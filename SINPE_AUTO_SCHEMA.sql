-- ==============================================================================
-- SISTEMA SINPE AUTO / CHECKER DE PAGOS SINPE MÓVIL EN TIEMPO REAL
-- BASE DE DATOS COMPLETA PARA SUPABASE & POSTGRESQL (MULTI-TENANT SAAS & STANDALONE)
-- ==============================================================================
-- Instrucciones:
-- 1. Ve al Dashboard de Supabase -> SQL Editor -> New Query.
-- 2. Pega todo el contenido de este archivo y presiona "Run".
-- 3. Las tablas, triggers, índices, RLS y canales Realtime quedarán activos inmediatamente.
-- ==============================================================================

-- 0. HABILITAR EXTENSIONES CRÍTICAS
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- 1. TABLA DE COMERCIOS / NEGOCIOS (MULTI-TENANT PARA SAAS B2B)
-- ==============================================================================
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_id text, -- Cédula Jurídica o Física
  phone_sinpe text not null, -- Teléfono receptor oficial (ej: 88888888 o 63842433)
  owner_email text not null unique,
  api_key text unique default ('sk_live_' || encode(gen_random_bytes(20), 'hex')),
  plan text not null default 'starter' check (plan in ('starter', 'pro', 'enterprise')),
  webhook_url text, -- URL donde el SaaS notificará los pagos aprobados
  active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- ==============================================================================
-- 2. TABLA DE AJUSTES IMAP (CREDENCIALES DE LECTURA DE CORREO POR COMERCIO)
-- ==============================================================================
create table if not exists public.business_imap_settings (
  business_id uuid primary key references public.businesses(id) on delete cascade,
  imap_host text not null default 'imap.gmail.com',
  imap_port integer not null default 993,
  imap_security text not null default 'ssl' check (imap_security in ('ssl', 'tls', 'ninguna')),
  imap_user text not null,
  imap_password text not null, -- Contraseña de aplicación generada en Gmail/Outlook
  monitored_bank text not null default 'BCR' check (monitored_bank in ('BCR', 'BAC', 'BNCR', 'PROMERICA', 'SCOTIABANK')),
  poll_interval_seconds integer not null default 20,
  debug_mode boolean not null default true,
  last_checked_at timestamp with time zone,
  last_status text default 'initialized',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- ==============================================================================
-- 3. TABLA DE SOLICITUDES DE PAGO / CHECKOUT INTELIGENTE
-- ==============================================================================
create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  client_reference text unique not null, -- Código único de 6 a 12 caracteres (ej: AVAL-839201 o ORD-10025)
  order_id text, -- ID de orden interna en WooCommerce, Shopify o App Móvil
  customer_name text,
  customer_phone text,
  customer_email text,
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'CRC',
  status text not null default 'pending' check (status in ('pending', 'paid', 'expired', 'cancelled')),
  metadata jsonb not null default '{}'::jsonb,
  expires_at timestamp with time zone not null default (now() + interval '20 minutes'),
  paid_at timestamp with time zone,
  created_at timestamp with time zone not null default now()
);

-- ==============================================================================
-- 4. TABLA DE PAGOS REALES CAPTURADOS (DESDE BANCO POR EMAIL O SMS)
-- ==============================================================================
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  payment_request_id uuid references public.payment_requests(id) on delete set null,
  orden_id text, -- ID de orden asociada
  sinpe_reference text not null, -- Comprobante oficial del banco (ej: 20261002839201 o 839201)
  sender_name text,
  sender_phone text,
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'CRC',
  status text not null default 'confirmed' check (status in ('confirmed', 'pending_link', 'revision', 'rejected')),
  bank_source text not null default 'BCR', -- BCR, BAC, BNCR
  raw_payload jsonb, -- Correo crudo o payload para auditoría notarial/bancaria
  created_at timestamp with time zone not null default now()
);

-- ==============================================================================
-- 5. TABLA DE LOGS DE WEBHOOKS SALIENTES (PARA NOTIFICAR A OTRAS TIENDAS)
-- ==============================================================================
create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  payment_id uuid references public.payments(id) on delete cascade,
  event_type text not null default 'payment.confirmed',
  endpoint_url text not null,
  request_payload jsonb not null,
  response_status integer,
  response_body text,
  attempts integer not null default 1,
  delivered boolean not null default false,
  created_at timestamp with time zone not null default now()
);

-- ==============================================================================
-- 6. ÍNDICES DE ALTO RENDIMIENTO (OPTIMIZADOS PARA TIEMPO REAL)
-- ==============================================================================
create index if not exists idx_payments_sinpe_ref on public.payments(sinpe_reference);
create index if not exists idx_payments_created_at on public.payments(created_at desc);
create index if not exists idx_payments_business on public.payments(business_id);
create index if not exists idx_payment_requests_ref on public.payment_requests(client_reference);
create index if not exists idx_payment_requests_status on public.payment_requests(status);
create index if not exists idx_businesses_apikey on public.businesses(api_key);

-- ==============================================================================
-- 7. FUNCIÓN Y TRIGGER DE AUTO-CONCILIACIÓN EN SEGUNDO PLANO
-- ==============================================================================
-- Cuando un pago entra por el lector de correo, esta función busca si en el motivo
-- o cuerpo venía el código de orden (ej: AVAL-839201) y la aprueba automáticamente.
create or replace function public.fn_auto_link_sinpe_payment()
returns trigger as $$
declare
  v_request record;
  v_payload_text text;
begin
  v_payload_text := coalesce(new.raw_payload::text, '') || ' ' || coalesce(new.sinpe_reference, '');

  -- 1. Intentar vincular por coincidencia de código en payment_requests
  for v_request in
    select id, client_reference, amount, order_id
    from public.payment_requests
    where status = 'pending'
      and (business_id = new.business_id or new.business_id is null)
      and amount = new.amount
    order by created_at desc
    limit 10
  loop
    -- Si el código aparece en el motivo o cuerpo del depósito
    if v_payload_text ilike ('%' || v_request.client_reference || '%') then
      new.payment_request_id := v_request.id;
      new.orden_id := coalesce(v_request.order_id, v_request.client_reference);
      new.status := 'confirmed';

      -- Actualizar la solicitud a estado 'paid'
      update public.payment_requests
      set status = 'paid', paid_at = now()
      where id = v_request.id;

      exit;
    end if;
  end loop;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_auto_link_sinpe_payment on public.payments;
create trigger trg_auto_link_sinpe_payment
before insert on public.payments
for each row execute function public.fn_auto_link_sinpe_payment();

-- ==============================================================================
-- 8. HABILITAR SUPABASE REALTIME (WEBSOCKETS PARA ALERTAS EN VIVO)
-- ==============================================================================
-- Esto permite que supabase.channel('payments').on('postgres_changes', ...) funcione.
begin;
  alter publication supabase_realtime add table public.payments;
  alter publication supabase_realtime add table public.payment_requests;
exception
  when duplicate_object then
    null;
end;

-- ==============================================================================
-- 9. POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
-- ==============================================================================
alter table public.businesses enable row level security;
alter table public.business_imap_settings enable row level security;
alter table public.payment_requests enable row level security;
alter table public.payments enable row level security;
alter table public.webhook_events enable row level security;

-- Política abierta para lectura y simulación en entorno de desarrollo / tienda
-- (En producción SaaS se conecta a auth.uid() de Supabase Auth)
create policy "Allow service_role full access to businesses"
  on public.businesses for all to service_role using (true) with check (true);

create policy "Allow read and insert on payment_requests"
  on public.payment_requests for all to anon, authenticated using (true) with check (true);

create policy "Allow read and insert on payments"
  on public.payments for all to anon, authenticated using (true) with check (true);

create policy "Allow service_role on imap_settings"
  on public.business_imap_settings for all to service_role using (true) with check (true);

-- ==============================================================================
-- 10. DATOS DE PRUEBA INICIALES (SEEDS LISTOS PARA USAR)
-- ==============================================================================
insert into public.businesses (id, name, phone_sinpe, owner_email, plan)
values (
  '11111111-1111-1111-1111-111111111111',
  'Aval Community CR',
  '63842433',
  'admin@avalmotors.cr',
  'enterprise'
) on conflict (owner_email) do nothing;

insert into public.business_imap_settings (
  business_id, imap_host, imap_port, imap_security, imap_user, imap_password, monitored_bank
) values (
  '11111111-1111-1111-1111-111111111111',
  'imap.gmail.com',
  993,
  'ssl',
  'admin@avalmotors.cr',
  'demo_app_password',
  'BCR'
) on conflict (business_id) do nothing;

insert into public.payment_requests (
  id, business_id, client_reference, customer_name, customer_phone, amount, status
) values (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'AVAL-10025',
  'Carlos Mora González',
  '88887777',
  25000.00,
  'pending'
) on conflict (client_reference) do nothing;

-- ==============================================================================
-- LISTO: Estructura creada con éxito. Realtime activado y trigger funcionando.
-- ==============================================================================
