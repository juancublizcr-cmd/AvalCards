# ParqueoSmart CR: Blueprint de App Moderna de Parqueos con Conciliación SINPE Móvil en Tablet
**Nombre del Proyecto:** `ParqueoSmart CR` (o `ParkAuto CR`)  
**Propósito:** Sistema integral de control, cobro, facturación y gestión operativa de parqueos comerciales en Costa Rica con verificación instantánea de transferencias SINPE Móvil en tablet para casetas y agujas.

---

## 1. Visión del Producto & Ventaja Competitiva

### El Problema en los Parqueos de Costa Rica:
1. **Sistemas obsoletos o cuadernos de papel:** Muchos parqueos en el centro de San José, Alajuela, Heredia y Cartago todavía anotan placas en papel o usan sistemas en Windows XP lentos con impresoras matriciales ruidosas.
2. **Caos en horas pico con SINPE Móvil:** Un conductor que va a salir busca su celular, pide el número de teléfono del parqueo, hace la transferencia y le muestra el comprobante al guarda. El guarda tiene que leer una pantalla pequeña al sol, provocando filas de 10 carros pitando.
3. **Fraude de comprobantes falsos:** Conductores inescrupulosos usan aplicaciones falsas generadoras de comprobantes del BCR o BAC con fecha actual y monto editado.
4. **Descuadres de caja y robo hormiga:** El dueño nunca sabe con certeza cuánto dinero en efectivo ingresó realmente ni cuánto cayó por SINPE porque no puede auditar minuto a minuto.

### La Solución de ParqueoSmart CR:
Una **PWA moderna y ultra rápida** que corre en cualquier tablet barata (\$80) en la caseta del guarda y en el teléfono del dueño:
- **Registro en 3 segundos:** El guarda escribe los 6 caracteres de la placa (ej: `BCG-821` o `M-10293`) y presiona "Ingresar". Opcional: tíquete digital por WhatsApp / SMS o tíquete térmico Bluetooth.
- **Cálculo automático de tarifa:** Fracción, hora, tarifa plana nocturna, día completo y tarifas diferenciadas para carros vs motos.
- **Modo Caseta en Tablet con Verificación SINPE:** El cliente hace el SINPE al número oficial del parqueo colocando su número de tiquete o placa en el motivo. La tablet emite un sonido fuerte de campana (`Ding-Dong`), se pone en **verde brillante gigante con la placa y el monto**, y le autoriza al guarda levantar la aguja.
- **Cierre de Caja Ciego:** El empleado declara cuánto efectivo tiene; el sistema compara con los SINPEs reales registrados en el banco y arroja el arqueo exacto sin fugas de dinero.

---

## 2. Diagrama de Flujo Operativo en el Parqueo

```
                  ┌──────────────────────────────┐
                  │ 1. INGRESO DEL VEHÍCULO      │
                  │ Guarda digita placa: BCG-821 │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
       Genera Tíquete #1042 con Hora de Ingreso (14:32:10)
     (Opción: imprimir recibo térmico o enviar por WhatsApp)
                                 │
                     [VEHÍCULO ESTACIONADO]
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │ 2. SALIDA Y COBRO            │
                  │ Guarda busca placa: BCG-821  │
                  └──────────────┬───────────────┘
                                 │
          El sistema calcula: 1 hora y 45 mins = ₡2,000
                                 │
         ┌───────────────────────┴───────────────────────┐
         ▼                                               ▼
     [EFECTIVO]                                    [SINPE MÓVIL]
 Guarda cobra ₡2,000                         Cliente envía ₡2,000
 Guarda presiona "Cobrado"                   Motivo: "1042" o "BCG821"
 Aguja se levanta.                                       │
                                                         ▼
                                             [CORREO DEL BANCO BCR/BAC]
                                                         │
                                                         ▼
                                             [WORKER SINPE EN 3 SEGUNDOS]
                                                         │
                                                         ▼
                                            [TABLET DE LA CASETA]
                                             🔊 ¡DING-DONG! (Sonido fuerte)
                                             🟩 "¡PAGO RECIBIDO! ₡2,000"
                                                Placa: BCG-821 · Ref: #839201
                                                         │
                                                         ▼
                                            [AGUJA SE LEVANTA DE INMEDIATO]
```

---

## 3. Modelo de Base de Datos (PostgreSQL / Supabase DDL)

Copia este script completo en el SQL Editor de tu proyecto Supabase para inicializar la base de datos de ParqueoSmart CR:

```sql
-- ==============================================================================
-- BASE DE DATOS: PARQUEOSMART COSTA RICA
-- ==============================================================================
create extension if not exists "uuid-ossp";

-- 1. PARQUEOS REGISTRADOS
create table if not exists public.parking_lots (
  id uuid primary key default gen_random_uuid(),
  name text not null, -- Ej: "Parqueo Central San José"
  address text,
  phone_sinpe text not null, -- Teléfono oficial para recibir transferencias
  business_name text not null, -- Razón Social para tiquetes y facturación
  legal_id text not null, -- Cédula jurídica/física
  total_spaces_cars integer not null default 30,
  total_spaces_motos integer not null default 15,
  grace_period_minutes integer not null default 10, -- Minutos de gracia tras pagar
  active boolean default true,
  created_at timestamptz default now()
);

-- 2. TARIFAS CONFIGURABLES POR VEHÍCULO Y HORARIO
create table if not exists public.parking_tariffs (
  id uuid primary key default gen_random_uuid(),
  parking_lot_id uuid references public.parking_lots(id) on delete cascade,
  vehicle_type text not null check (vehicle_type in ('carro', 'moto', 'camion')),
  price_first_hour numeric(10, 2) not null default 1000, -- ₡1,000 primera hora
  price_fraction numeric(10, 2) not null default 500, -- ₡500 cada 30 min adicionales
  fraction_minutes integer not null default 30,
  flat_rate_night numeric(10, 2) default 4000, -- Tarifa plana noche
  flat_rate_day numeric(10, 2) default 6000, -- Tarifa plana 12 horas
  lost_ticket_penalty numeric(10, 2) default 5000, -- Cobro por tiquete extraviado
  created_at timestamptz default now()
);

-- 3. TURNOS DE CAJERO / GUARDA
create table if not exists public.parking_shifts (
  id uuid primary key default gen_random_uuid(),
  parking_lot_id uuid references public.parking_lots(id) on delete cascade,
  guard_name text not null,
  opened_at timestamptz default now(),
  closed_at timestamptz,
  initial_cash numeric(10, 2) not null default 10000, -- Caja chica en monedas
  declared_cash numeric(10, 2), -- Cuánto efectivo contó el guarda al cerrar
  total_sinpe numeric(10, 2) default 0, -- Calculado automáticamente por el checker
  total_cash numeric(10, 2) default 0,
  status text not null default 'open' check (status in ('open', 'closed')),
  notes text
);

-- 4. TIQUETES DE ESTACIONAMIENTO (ENTRADA Y SALIDA)
create table if not exists public.parking_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number serial, -- Número consecutivo corto para el cliente (ej: #1042)
  parking_lot_id uuid references public.parking_lots(id) on delete cascade,
  shift_id uuid references public.parking_shifts(id) on delete set null,
  plate text not null, -- Placa del vehículo (ej: "BCG-821" o "M-9283")
  vehicle_type text not null default 'carro' check (vehicle_type in ('carro', 'moto', 'camion')),
  customer_phone text, -- Si desea el tiquete digital por WhatsApp
  entry_time timestamptz not null default now(),
  exit_time timestamptz,
  total_minutes integer,
  amount_due numeric(10, 2) default 0,
  payment_method text check (payment_method in ('sinpe', 'efectivo', 'tarjeta', 'mensualidad')),
  status text not null default 'parked' check (status in ('parked', 'paid', 'cancelled', 'lost_ticket')),
  sinpe_payment_id uuid, -- Enlace con la tabla payments
  created_at timestamptz default now()
);

-- 5. ABONADOS / MENSUALIDADES (CLIENTES FIJOS)
create table if not exists public.parking_subscribers (
  id uuid primary key default gen_random_uuid(),
  parking_lot_id uuid references public.parking_lots(id) on delete cascade,
  customer_name text not null,
  customer_phone text not null,
  plate text not null unique,
  monthly_fee numeric(10, 2) not null default 35000, -- ₡35,000 mensualidad
  billing_day integer not null default 1, -- Día de cobro de cada mes
  valid_until date not null,
  active boolean default true,
  created_at timestamptz default now()
);

-- 6. ÍNDICES Y REALTIME
create index if not exists idx_tickets_plate on public.parking_tickets(plate);
create index if not exists idx_tickets_status on public.parking_tickets(status);
create index if not exists idx_tickets_entry on public.parking_tickets(entry_time desc);

alter publication supabase_realtime add table public.parking_tickets;
alter publication supabase_realtime add table public.parking_lots;
```

---

## 4. Funcionalidades Principales de la Aplicación

### A. Pantalla 1: Ingreso Rápido (Touchscreen para Tablet)
- **Teclado numérico y de letras gigante:** Optimizado para tocar con guantes o dedos rápidos.
- **Acceso rápido a tipos de vehículo:** Botón grande `🚗 Carro` y `🏍️ Moto`.
- **Acción inmediata:** Al presionar "Ingresar", el sistema registra la hora con precisión de segundos y muestra el número de tiquete (ej: `#1042`).
- **Tíquete Térmico / Digital:** Si tiene mini-impresora Bluetooth (58mm), sale el papelito; si no, el cliente le toma una foto a la tablet o da su WhatsApp.

### B. Pantalla 2: Salida y Cobro en Tiempo Real
- El guarda escribe la placa o número de tiquete.
- La app calcula automáticamente:
  - Tiempo transcurrido (ej: `1h 24m`).
  - Total exacto según la tarifa (ej: `₡1,500`).
- Aparecen 2 botones gigantes:
  - **[💵 Cobrar Efectivo]**
  - **[📱 Esperar SINPE Móvil]**

### C. La Joya de la Corona: "Modo Aguja / Caseta" (Tablet View)
Cuando el guarda selecciona **Esperar SINPE Móvil**:
1. La tablet muestra en pantalla grande:
   > **Transfiera ₡1,500 al 6384-2433**  
   > Motivo: **Tiquete 1042** o **Placa BCG-821**
2. El listener de Supabase Realtime se queda escuchando la tabla `payments`.
3. En cuanto el banco envía la notificación y el checker la procesa (3 a 5 segundos):
   - **La tablet suena un chime fuerte (Ding-Dong) con Web Audio API.**
   - **La pantalla entera se pone en VERDE brillante:**
     ```
     ===========================================
     ✅ ¡PAGO VERIFICADO EN EL BANCO!
     Monto: ₡1,500
     Placa: BCG-821 · Tiquete #1042
     Emisor: Carlos Mora González
     Comprobante Banco: #83910294
     ===========================================
     [LEVENTAR AGUJA / COMPLETAR SALIDA]
     ```
4. El guarda ni siquiera tiene que acercarse al chofer. Ve el verde a 3 metros de distancia, levanta la aguja y el carro sale.

### D. Control de Ocupación en Tiempo Real
En la parte superior de la caseta:
- `🚗 Carros: 24 / 30 ocupados (6 Libres)`
- `🏍️ Motos: 8 / 15 ocupadas (7 Libres)`
- Si el parqueo está lleno, la pantalla avisa en rojo: **"PARQUEO COMPLETO"** para no dejar entrar más carros.

### E. Cierre de Turno y Arqueo Ciego
Al finalizar la jornada (ej: a las 10:00 p.m.):
1. El guarda presiona **"Cerrar Turno"**.
2. El guarda **no sabe** cuánto dinero dice el sistema que debería haber.
3. El sistema le pide: *"Digite cuánto efectivo tiene en la gaveta"*.
4. El sistema compara:
   - Efectivo cobrado real vs declarado.
   - Total recibido en SINPE Móvil (auditado comprobante por comprobante del banco).
   - Genera el reporte del turno en PDF y lo manda automáticamente al WhatsApp del dueño del parqueo.

---

## 5. Integración con Apertura Automática de Aguja (Hardware IoT Opcional)

Si el parqueo tiene aguja vehicular eléctrica, se puede automatizar la apertura sin que el guarda toque nada:

```
[TABLET CONFIRMA PAGO SINPE]
             │
             ▼ Webhook HTTP local (POST http://192.168.1.150/abrir)
[RELÉ INTELIGENTE WIFI (Sonoff / ESP32 / Shelly)]
             │
             ▼ Pulso seco de 1 segundo
[MOTOR DE LA AGUJA VEHICULAR (BFT / Came / Beninca)]
             │
             ▼
        Aguja sube sola
```
*Costo del relé WiFi:* Menos de \$15 USD (₡8,000 colones).

---

## 6. Kit de Instalación para Vender a Parqueos

| Componente | Descripción | Costo Aprox. |
| :--- | :--- | :--- |
| **Tablet Android** | Tablet 10 pulgadas básica (Lenovo M9 o Amazon Fire HD 10) | \$90 USD (₡47,000) |
| **Soporte de Pared/Mesa** | Brazo metálico articulado con candado antirrobo para la caseta | \$20 USD (₡10,500) |
| **Impresora Térmica 58mm** | Mini impresora térmica Bluetooth/USB (para tíquetes de papel) | \$25 USD (₡13,000) |
| **App ParqueoSmart** | Sistema configurado con su banco, tarifas y número SINPE | **₡25,000 a ₡45,000 / mes** |

---

## 7. Plan de Ejecución para Construir la App

1. **Backend:** Reutilizar la tabla `payments` y el worker `SINPE_DAEMON_WORKER.js` que ya tenemos en este repositorio, añadiendo las tablas de parqueo (`PARQUEO_SMART_CR_BLUEPRINT.md`).
2. **Frontend:** Crear la interfaz en React + Tailwind con:
   - Teclado táctil para digitar placas rápidamente.
   - Reloj con cálculo dinámico de tarifa por minuto.
   - Vista de pantalla completa para la tablet con Web Audio API para alertas sonoras a alto volumen.
3. **PWA (Progressive Web App):** Guardar en la tablet como aplicación instalable que funciona a pantalla completa (modo Kiosco) y almacena datos localmente por si se cae el Wi-Fi unos minutos.
