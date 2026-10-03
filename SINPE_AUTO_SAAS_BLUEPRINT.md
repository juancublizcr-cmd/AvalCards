# Blueprint de Arquitectura: Módulo & SaaS de Conciliación Automática SINPE Móvil
**Nombre del Sistema:** `SINPE Auto / Checker SINPE CR`  
**Objetivo:** Guía integral y técnica para construir un producto SaaS independiente B2B o integrar este módulo de conciliación bancaria en tiempo real en cualquier aplicación web, e-commerce o app móvil en Costa Rica.

---

## 1. Visión General del Negocio & Problema

### El Problema en Costa Rica:
1. El 80%+ de las transferencias en comercio digital en Costa Rica se hacen por **SINPE Móvil**.
2. Los comercios sufren pérdidas por:
   - **Comprobantes falsos (screenshots editados)** generados con apps falsas o Photoshop.
   - **Conciliación manual lenta**: el cajero o dueño debe abrir la app bancaria cada vez que entra un pedido para verificar si la plata realmente cayó.
   - **Carritos abandonados**: los clientes se frustran cuando se les pide subir comprobantes o esperar horas por aprobación manual.

### La Solución Automatizada:
El sistema intercepta la notificación oficial que el banco (BCR, BAC, BNCR) emite automáticamente tras una transferencia SINPE Móvil, extrae los datos mediante un parser de expresiones regulares (monto, fecha, comprobante y código único de orden), lo inserta en una base de datos en tiempo real (Supabase / PostgreSQL) y aprueba la orden en menos de 5 segundos con feedback sonoro y visual.

---

## 2. Diagrama de Arquitectura de Flujo

```
 [CLIENTE EN CHECKOUT]
         │
         ▼
 1. Genera código único (ej: AVAL-839201)
 2. Transfiere por SINPE Móvil colocando el código en el "Motivo / Detalle"
         │
         ▼
 [BANCO (BCR / BAC / BNCR)]
         │
         ├─────────────────────────────────────────┐
         ▼                                         ▼
Opción A: Notificación Email               Opción B: Webhook Inbound
(mensajero@bancobcr.com)                  (Mailgun / SendGrid / Postmark)
         │                                         │
         ▼                                         ▼
[WORKER IMAP DAEMON (Node.js/Python)]     [EDGE FUNCTION / API REST]
• Lee bandeja vía TLS 993                 • Recibe el JSON del correo entrante
• Parsea con Regex (Monto, Ref, Código)   • Parsea con Regex
         │                                         │
         └────────────────────┬────────────────────┘
                              │
                              ▼
                  [BASE DE DATOS SUPABASE]
               Tabla: public.payments (INSERT)
               Publicación: supabase_realtime
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
    [CHECKOUT DEL CLIENTE]          [DASHBOARD DEL ADMIN / CAJERO]
• Escucha canal Realtime         • Escucha canal Realtime
• Timer circular se detiene      • Pop-up en pantalla completa
• ¡Pago confirmado en verde!     • Chime sonoro (Web Audio) + Confeti
• Orden pasa a "Aprobada"        • Conciliación 100% automática
```

---

## 3. Modelo de Base de Datos (PostgreSQL / Supabase)

Para operar como **SaaS Multi-Inquilino (Multi-Tenant)** o como módulo interno, ejecuta este script DDL en el editor SQL de Supabase:

```sql
-- ============================================================
-- 1. TABLA DE COMERCIOS / NEGOCIOS (Para SaaS B2B)
-- ============================================================
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone_sinpe text not null, -- Número SINPE oficial del negocio (ej: 88888888)
  owner_email text not null,
  api_key text unique default encode(gen_random_bytes(24), 'hex'),
  plan text default 'starter', -- starter, pro, enterprise
  active boolean default true,
  created_at timestamp with time zone default now()
);

-- ============================================================
-- 2. CREDENCIALES IMAP ENCRIPTADAS (Para lectura bancaria)
-- ============================================================
create table if not exists public.business_imap_settings (
  business_id uuid primary key references public.businesses(id) on delete cascade,
  imap_host text not null default 'imap.gmail.com',
  imap_port integer not null default 993,
  imap_security text not null default 'ssl', -- ssl, tls
  imap_user text not null,
  imap_password text not null, -- Contraseña de aplicación
  monitored_bank text not null default 'BCR', -- BCR, BAC, BNCR
  debug_mode boolean default false,
  updated_at timestamp with time zone default now()
);

-- ============================================================
-- 3. SOLICITUDES DE PAGO / ÓRDENES DE CHECKOUT
-- ============================================================
create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  client_reference text unique not null, -- Código único en el motivo (ej: AVAL-102934)
  customer_name text,
  customer_phone text,
  amount numeric(12, 2) not null,
  status text not null default 'pending', -- pending, paid, expired, cancelled
  metadata jsonb default '{}'::jsonb,
  expires_at timestamp with time zone default (now() + interval '15 minutes'),
  created_at timestamp with time zone default now()
);

-- ============================================================
-- 4. PAGOS BANCARIOS REALES CAPTURADOS (Email / SMS)
-- ============================================================
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  payment_request_id uuid references public.payment_requests(id) on delete set null,
  orden_id text, -- ID de orden interna en la app o e-commerce
  sinpe_reference text not null, -- Número de comprobante bancario (ej: 20261002839201)
  sender_name text,
  sender_phone text,
  amount numeric(12, 2) not null,
  currency text default 'CRC',
  status text not null default 'confirmed', -- confirmed, pending_link, revision
  bank_source text default 'BCR',
  raw_payload jsonb, -- Texto completo del correo para auditoría legal
  created_at timestamp with time zone default now()
);

-- ============================================================
-- 5. ÍNDICES DE ALTO RENDIMIENTO
-- ============================================================
create index if not exists idx_payments_sinpe_ref on public.payments(sinpe_reference);
create index if not exists idx_payments_created_at on public.payments(created_at desc);
create index if not exists idx_payment_requests_ref on public.payment_requests(client_reference);
create index if not exists idx_payments_business on public.payments(business_id);

-- ============================================================
-- 6. HABILITAR TIEMPO REAL (REALTIME)
-- ============================================================
alter publication supabase_realtime add table public.payments;
alter publication supabase_realtime add table public.payment_requests;

-- ============================================================
-- 7. TRIGGER PARA AUTO-CONCILIACIÓN EN BASE DE DATOS
-- ============================================================
create or replace function public.auto_link_payment_request()
returns trigger as $$
declare
  v_req record;
begin
  -- Buscar si el raw_payload o el motivo contiene algún código de orden pendiente
  if new.raw_payload is not null then
    for v_req in 
      select id, client_reference, amount from public.payment_requests 
      where status = 'pending' and amount = new.amount
    loop
      if (new.raw_payload::text ilike '%' || v_req.client_reference || '%') then
        new.payment_request_id := v_req.id;
        new.status := 'confirmed';
        
        -- Marcar la solicitud como pagada
        update public.payment_requests 
        set status = 'paid' 
        where id = v_req.id;
        
        exit;
      end if;
    end loop;
  end if;
  return new;
end;
$$ language plpgsql;

create or replace trigger trg_auto_link_payment
before insert on public.payments
for each row execute function public.auto_link_payment_request();
```

---

## 4. El Motor de Expresiones Regulares (Parsers Bancarios de Costa Rica)

Cada banco costarricense envía un formato HTML/Texto propio. Aquí están las expresiones regulares exactas para extraer los datos:

### A. Banco de Costa Rica (BCR) — `mensajero@bancobcr.com`
- **Asunto típico:** `SINPE Móvil / Notificación de transferencia recibida`
- **Patrón Regex:**
```typescript
export function parsearCorreoBCR(cuerpoTexto: string) {
  // 1. Extraer Monto en Colones o Dólares
  const regexMonto = /(?:monto|importe|cantidad)[:\s]*(?:₡|CRC|¢)?\s*([\d,]+(?:\.\d{2})?)/i;
  // 2. Extraer Comprobante / Referencia
  const regexComprobante = /(?:comprobante|referencia|número de transferencia|num\.?\s*transacción)[:\s#]*([a-zA-Z0-9]{6,20})/i;
  // 3. Extraer Nombre de Quien Envía
  const regexEmisor = /(?:origen|emisor|de|cliente|ordenante)[:\s]*([A-ZÁÉÍÓÚÑa-záéíóúñ\s]{3,45})/i;
  // 4. Extraer el Código Único en el Motivo/Detalle
  const regexCodigo = /(?:motivo|detalle|concepto|descripción)[:\s]*.*?(AVAL-[A-Z0-9]+|PEDIDO-\d+|ORD-\d+|[A-Z0-9]{6,12})/i;

  const matchMonto = cuerpoTexto.match(regexMonto);
  const matchComp = cuerpoTexto.match(regexComprobante);
  const matchEmisor = cuerpoTexto.match(regexEmisor);
  const matchCodigo = cuerpoTexto.match(regexCodigo);

  return {
    monto: matchMonto ? parseFloat(matchMonto[1].replace(/,/g, "")) : 0,
    referencia: matchComp ? matchComp[1].trim() : "",
    emisor: matchEmisor ? matchEmisor[1].trim() : "Cliente SINPE",
    codigoOrden: matchCodigo ? matchCodigo[1].trim() : null,
  };
}
```

### B. BAC Credomatic — `notificaciones@baccredomatic.com`
- **Asunto típico:** `Notificación de transferencia SINPE Móvil recibida`
- **Patrón Regex:**
```typescript
export function parsearCorreoBAC(cuerpoTexto: string) {
  const regexMonto = /Monto[:\s]*CRC\s*([\d,]+(?:\.\d{2})?)/i;
  const regexComprobante = /Número de referencia[:\s]*(\d{8,16})/i;
  const regexEmisor = /Transferido por[:\s]*([A-Z\s]{3,40})/i;
  const regexCodigo = /Descripción[:\s]*.*?(AVAL-[A-Z0-9]+|[A-Z0-9]{6,10})/i;
  // ...
}
```

### C. Banco Nacional (BNCR) — `bancopersonal@bncr.fi.cr`
- **Asunto típico:** `Acreditación SINPE Móvil`
- **Patrón Regex:**
```typescript
export function parsearCorreoBNCR(cuerpoTexto: string) {
  const regexMonto = /(?:Monto Acreditado|Importe)[:\s]*(?:₡)?\s*([\d,]+(?:\.\d{2})?)/i;
  const regexComprobante = /(?:No\.\s*Comprobante|Referencia SINPE)[:\s]*(\d{6,15})/i;
  // ...
}
```

---

## 5. El Lector de Correos en Segundo Plano (Worker Daemon)

Un navegador web **nunca** debe intentar conectarse al puerto 993 directamente. Para producción, se utiliza un servicio ligero en Node.js o una Edge Function.

### Implementación del Daemon (`scripts/sinpe-checker-daemon.mjs`):

```javascript
import tls from "node:tls";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Ejecutar cada 20 segundos
async function loopMonitoreo() {
  console.log("🔍 Verificando correos bancarios...");
  
  // 1. Obtener credenciales de comercios activos
  const { data: configs } = await supabase.from("business_imap_settings").select("*");
  
  for (const cfg of configs || []) {
    try {
      await procesarBuzonComercio(cfg);
    } catch (err) {
      console.error(`Error en comercio ${cfg.business_id}:`, err.message);
    }
  }
}

async function procesarBuzonComercio(cfg) {
  // Conexión TLS sobre puerto 993
  const socket = tls.connect({
    host: cfg.imap_host,
    port: cfg.imap_port,
    rejectUnauthorized: false,
  });

  // Protocolo IMAP:
  // 1. TAG1 LOGIN
  // 2. TAG2 SELECT INBOX
  // 3. TAG3 SEARCH UNSEEN FROM "mensajero@bancobcr.com"
  // 4. TAG4 FETCH 1:* (BODY[TEXT])
  // 5. Parsea con Regex y hace INSERT en Supabase payments
  // 6. TAG5 STORE +FLAGS (\Seen)
  // 7. TAG6 LOGOUT
}

setInterval(loopMonitoreo, 20000);
```

---

## 6. Componentes del Frontend (React + Tailwind + Supabase)

### A. Widget del Checkout (`SinpeWidget.tsx`)
1. **Paso 1:** Teléfono receptor con botón "Copiar".
2. **Paso 2:** Monto exacto en Colones (`₡25,000.00`).
3. **Paso 3:** Código único de orden (ej: `AVAL-839201`) para el motivo del SINPE con botón "Copiar".
4. **Botón "Ya hice el SINPE Móvil":** Dispara una cuenta regresiva circular SVG de `02:00` minutos mientras activa la escucha en tiempo real:
```typescript
useEffect(() => {
  const canal = supabase
    .channel("checkout-payment")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "payments" },
      (payload) => {
        const raw = JSON.stringify(payload.new.raw_payload || "");
        if (raw.includes(codigoOrden) || payload.new.sinpe_reference === refBuscada) {
          setEstado("verificado");
          onPagoVerificado(payload.new);
        }
      }
    )
    .subscribe();

  return () => { void canal.unsubscribe(); };
}, [codigoOrden]);
```

### B. Dashboard Administrativo de Conciliación (`SinpeAutoSection.tsx`)
- **Badge en tiempo real:** Muestra `Realtime Activo` en verde con pulso cuando el websocket de Supabase está conectado.
- **KPIs Responsivos:** Tarjetas de Cobrado Hoy, Transacciones Confirmadas y Pagos Pendientes estructurados en 2 columnas en tablet y 4 en desktop.
- **Campana Sonora (Web Audio API):**
```typescript
export function reproducirSonidoExito() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") void ctx.resume();
  
  const t = ctx.currentTime;
  // Doble campana brillante 987Hz -> 1318Hz
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.frequency.setValueAtTime(987.77, t);
  gain1.gain.setValueAtTime(0.4, t);
  gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(t);
  osc1.stop(t + 0.3);

  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "triangle";
  osc2.frequency.setValueAtTime(1318.51, t + 0.1);
  gain2.gain.setValueAtTime(0.45, t + 0.1);
  gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(t + 0.1);
  osc2.stop(t + 0.6);
}
```
- **Modal de Alerta Fullscreen:** Si entra un pago confirmado mientras el cajero o administrador tiene abierta la pantalla, se despliega una tarjeta de confirmación inmediata con el monto en grande, referencia, nombre del emisor y confeti animado (`canvas-confetti`).

---

## 7. Modelo de Monetización si se convierte en un SaaS B2B

Para comercializar este sistema como un **SaaS independiente en Costa Rica** (ej: `SinpeAuto.cr` o `VerificaSinpe.com`):

| Plan | Precio Sugerido | Límite de Transacciones | Características |
| :--- | :--- | :--- | :--- |
| **Emprendedor** | \$15 / mes (₡7,700) | Hasta 100 pagos / mes | 1 Tienda, alerta en pantalla, 1 cuenta bancaria. |
| **Comercio Pro** | \$39 / mes (₡20,000) | Hasta 500 pagos / mes | Widget para Shopify/WooCommerce, multi-banco (BCR + BAC + BNCR). |
| **Empresarial** | \$89 / mes (₡46,000) | Pagos Ilimitados | API Keys, Webhooks de salida, multi-sucursales, soporte prioritario. |

### API Pública del SaaS para Integrar en Otras Apps:
Cualquier cliente externo puede crear órdenes y escuchar pagos con una simple llamada HTTP:

```bash
# 1. Crear solicitud de pago desde el backend de cualquier app:
POST https://api.sinpeauto.cr/v1/payment-requests
Authorization: Bearer SAAS_API_KEY
Content-Type: application/json

{
  "amount": 25000,
  "client_reference": "ORD-1092",
  "customer_phone": "88888888"
}

# Respuesta:
{
  "id": "req_83921",
  "code": "AVAL-83921",
  "phone": "63842433",
  "amount": 25000,
  "qr_url": "https://api.sinpeauto.cr/qr/req_83921.png"
}
```

---

## 8. Checklist de Despliegue en Producción

1. **Crear las tablas en Supabase:** Ejecutar el script SQL del punto 3 en el SQL Editor del proyecto.
2. **Habilitar Realtime:** Asegurarse de que la tabla `public.payments` esté incluida en la publicación `supabase_realtime`.
3. **Generar Contraseña de Aplicación en Gmail:** 
   - Entrar a la cuenta de Google que recibe los correos del banco.
   - Seguridad ➔ Verificación en 2 pasos ➔ Contraseñas de aplicaciones.
   - Crear una contraseña de 16 letras exclusiva para el verificador (ej: `abcd efgh ijkl mnop`).
4. **Configurar el Banco:** En la banca en línea del BCR, BAC o BNCR, verificar que las notificaciones de SINPE Móvil estén dirigidas al correo electrónico configurado.
5. **Iniciar el Daemon:** En un servidor VPS (DigitalOcean, Railway, Render o Supabase Edge Functions con Cron), levantar el script del worker.
6. **Probar el Flujo Completo:** Realizar una transferencia de ₡100 con el código generado para verificar la auto-aprobación en menos de 5 segundos.
