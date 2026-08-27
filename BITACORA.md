# Bitácora del Proyecto: Aval Motors CR (PWA Digital)

**Última actualización:** 26 de Agosto de 2026  
**Dominio Oficial:** [https://www.avalcomunity.com](https://www.avalcomunity.com)  
**Dominio Vercel:** [https://aval-cards.vercel.app](https://aval-cards.vercel.app)  
**Repositorio GitHub:** [https://github.com/juancublizcr-cmd/AvalCards](https://github.com/juancublizcr-cmd/AvalCards)

---

## 📋 Resumen Ejecutivo
Plataforma web progresiva (PWA) de rifas, tokens digitales y juegos promocionales instantáneos (*Raspa & Gana* y *Ruleta de la Fortuna*) para **Aval Motors CR**, con backend serverless en **Supabase** y despliegue global de alto rendimiento en **Vercel Edge Network** con dominio propio bajo HTTPS/SSL.

---

## 🚀 Hitos y Registro de Cambios

### 1. Infraestructura y Despliegue en Producción
- **Configuración de Vercel & Vite PWA:**
  - Creación de motor de pre-renderizado estático (`scripts/prerender.js`) integrado en el comando `build`.
  - Configuración de `vercel.json` con soporte SPA routing y caché inmutable de assets en CDN (`/assets/`).
  - Creación de `.npmrc` con `legacy-peer-deps=true` para garantizar compatibilidad total en builds de Vercel.
- **Configuración de Dominio Propio en Namecheap:**
  - Dominio: `avalcomunity.com` / `www.avalcomunity.com`
  - Registro DNS Tipo A apuntado a `216.198.79.1`
  - Registro CNAME `www` apuntado al servidor edge de Vercel.
  - Certificado SSL automático emitido y validado 100% activo.

### 2. Base de Datos y Backend (Supabase)
- **Instancia:** `https://zdyygdivjhftirykvjjk.supabase.co`
- **Tablas:**
  - `ordenes`: Registro de compras, folios criptográficos, tokens asignados, supertokens, comprobantes SINPE y estado (`pendiente`, `aprobada`, `rechazada`).
  - `premios`: Configuración dinámica de primer lugar (Toyota Prado / Mercedes Benz), segundo lugar (Moto) y tercer lugar (PS5).
  - `sorteo_config`: Parámetros del sorteo, garantías legales, testimonios de ganadores pasados y configuración de juegos express.
  - `site_config`: Configuración general de la plataforma, pasarelas de pago (SINPE, TiloPay, Cripto USDT) y control de ventas.
  - `premios_instantaneos`: Folios asignados para premios instantáneos de sorteos.
  - `inventario`: Control de stock disponible y asignación aleatoria/manual.

### 3. Modo Promocional / Preventa Exclusiva (Próximamente)
- **Componente `FlyerPromocional.tsx`:**
  - Pantalla completa oscura de lujo (`#070709`) con efectos de iluminación neón.
  - Ocultación total de la tienda, paquetes y juegos cuando las ventas están en pausa.
  - Reloj de cuenta regresiva en vivo a **7 Días** para la Gran Apertura Oficial.
  - Flyer showcase con foto del vehículo (Toyota Prado 2026), badge 0KM y Bono \$6,000 USD.
  - Botón gigante y llamativo de WhatsApp para unirse a la preventa y lista de espera.
  - Cabecera limpia y centrada exclusivamente con el logo de Aval Motors CR.
- **Control Administrativo:**
  - Switch de 1 clic en la barra superior del Admin (`/admin`) y en *Configuración General* para alternar entre **Modo Promo** y **Venta Abierta**.

### 4. Módulos de Juegos Express y Fidelización
- **Ruleta de la Fortuna Express:**
  - Parada manual en seco mediante botón rojo con micro-desaceleración física realista.
  - Asignación de folios criptográficos inmutables para cobro de premios vía SINPE Móvil.
- **Raspa y Gana Digital:**
  - Simulación de raspado con mouse/dedo sobre capa metalizada con partículas de confeti.
- **Modelo Híbrido de Giros Gratis:**
  - Incentivos de giros gratis al adquirir paquetes de tokens oficiales.

### 5. Módulo Avanzado de Referidos y Afiliados (Padres e Hijos)
- **Normalización de Referentes en Base de Datos:**
  - Codificación y persistencia inmutable de referentes mediante formato `[REF:telefono]` en `transaccion_id` y ordenes.
- **Panel de Referidos y Padre en `/validar`:**
  - Vista para el Referente (Padre): total de amigos invitados, tokens de regalo ganados y lista completa con nombres, teléfonos formateados y estado de acreditación.
  - Vista para el Referido (Hijo): tarjeta destacada `👑 Tu Referente Padre Oficial` con nombre completo, teléfono y botón de contacto directo por WhatsApp.
- **Protección Anti-Fraude en `/checkout`:**
  - Verificación en tiempo real de compradores existentes para prevenir alteración de referentes o duplicación de bonos.

### 6. Nuevas Pasarelas de Pago Internacionales y Express
- **Configuración en Panel Admin (`/admin` -> Configuración y Pasarelas):**
  - 🅿️ **PayPal Checkout:** Control activo/inactivo, Client ID REST API, Email comercial y switch Sandbox/Live.
  - 🍏 **Apple Pay:** Control activo/inactivo, Apple Merchant Identifier (`merchant.cr.avalmotors`) y validación SSL.
  - 🌐 **Google Pay:** Control activo/inactivo y Google Merchant ID.
- **Experiencia de Compra en `/checkout`:**
  - Selector interactivo de 6 métodos de pago (SINPE Móvil, Tarjetas TiloPay, PayPal, Apple Pay, Google Pay y Cripto USDT).
  - Bloques de procesamiento y botones con identidad visual oficial para cada pasarela.
- **Registro y Filtros en `/admin` (Pagos y Transacciones):**
  - Filtro por método de pago y badges distintivos para cada pasarela.

### 7. Sistema de Escrutinio Oficial Dual (Lotería Nacional JPS)
- **Modalidad 1: Serie y Número (Lotería Nacional de Costa Rica):**
  - Ingreso de Serie (3 dígitos) y Número (2 dígitos) para 1°, 2° y 3° premio.
  - Generación directa del token oficial de 5 dígitos (ej. Serie `288` + Número `71` = Token `28871`).
- **Modalidad 2: Algoritmo Combinado (3 Premios):**
  - Combinación de bloques de 2 dígitos del 1° y 2° premio con la última cifra del 3° premio (fórmula directa e invertida).
- **Cruce y Notificación en Tiempo Real:**
  - Verificación instantánea contra la tabla `ordenes` de Supabase.
  - Visualización de clientes ganadores, asignación de premio, detección de SuperToken (+$6,000 USD Cash) y botón WhatsApp con mensaje de felicitación prellenado.

---

## 🔐 Acceso Administrativo
- **Ruta Privada:** `/admin`
- **Login:** `/login`
- **Gestión:**
  - Métricas de ventas en tiempo real.
  - Validación y aprobación de comprobantes SINPE y pagos digitales.
  - Escrutinio dual con Lotería Nacional (Serie + Número) y algoritmo combinado.
  - CRM de clientes y estadísticas de compra.
  - Gestión de pasarelas de pago y configuración de plataforma.

