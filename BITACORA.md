# Bitácora del Proyecto: Aval Community CR (PWA Digital)

**Última actualización:** 1 de Septiembre de 2026  
**Dominio Oficial:** [https://www.avalcomunity.com](https://www.avalcomunity.com)  
**Dominio Vercel:** [https://aval-cards.vercel.app](https://aval-cards.vercel.app)  
**Repositorio GitHub:** [https://github.com/juancublizcr-cmd/AvalCards](https://github.com/juancublizcr-cmd/AvalCards)

---

## 📋 Resumen Ejecutivo
Plataforma web progresiva (PWA) de rifas, tokens digitales y juegos promocionales instantáneos (*Raspa & Gana* y *Ruleta de la Fortuna*) para **Aval Community CR**, con backend serverless en **Supabase** y despliegue global de alto rendimiento en **Vercel Edge Network** con dominio propio bajo HTTPS/SSL.

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
  - Cabecera limpia y centrada exclusivamente con el logo de Aval Community CR.
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
  - 🍏 **Apple Pay:** Control activo/inactivo, Apple Merchant Identifier (`merchant.cr.avalcommunity`) y validación SSL.
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

### 8. Herramientas Virales, FOMO y Retención (Control 100% Modular desde Admin)
- **1. Notificaciones Flotantes en Vivo (FOMO & Prueba Social):**
  - Componente flotante `FomoNotifications` con compras verificadas y premios instantáneos de raspa/ruleta.
  - Switch administrativo On/Off (`fomoActivo`) en Panel Admin.
- **2. Concurso y Ranking Mensual de Referidos (Afiliados):**
  - Podio interactivo (🥇, 🥈, 🥉) y tabla de posiciones de los Top 10 usuarios que más amigos invitan.
  - Configuración desde Admin de premios en efectivo SINPE (1°, 2° y 3° lugar) y fecha de cierre mensual (`rankingReferidosActivo`, `rankingPremioPrimero`, `rankingPremioSegundo`, `rankingPremioTercero`, `rankingFechaCierre`).
- **3. Generador de Historias para Estados de WhatsApp e Instagram (9:16):**
  - Motor de renderizado en HTML5 Canvas (`story-canvas.ts`) en formato vertical 1080x1920 con diseño de lujo, badges de tokens oficiales y enlace/QR de referido.
  - Modal interactivo `StoryShareModal` en Checkout y Validador con descarga HD en 1 clic y soporte para Web Share API.
  - Switch administrativo On/Off (`generadorHistoriasActivo`).
- **4. Mini-Sorteos Semanales de Gasolina / Supermercado:**
  - Módulo `MiniSorteosSection` con reloj en cuenta regresiva todos los viernes a las 7:00 PM.
  - Configuración de título, premio y fecha desde Admin (`miniSorteosActivo`, `miniSorteoTitulo`, `miniSorteoPremio`).
- **5. Banner de Instalación Rápida PWA:**
  - Notificación no invasiva `PwaInstallPrompt` para añadir Aval Community CR a la pantalla de inicio con 1 toque en Android y guía interactiva en 2 pasos para iPhone / Safari.
  - Switch administrativo On/Off (`pwaBannerActivo`).

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
  - Interruptores y configuración de las 5 herramientas de viralidad y retención.

---

## 🚀 Hito 9: Perfeccionamiento de Flujos, Auto-Validación y Universalidad Multi-Premio

1. **Corrección de Import en `/validar` (`useEffect`):**
   - Corregido el error de `ReferenceError: useEffect is not defined` importándolo directamente de React.
   - Implementada la búsqueda automática al cargar la pantalla si el usuario viene de registrar su compra en `/checkout`.

2. **Visualización y Persistencia de Tokens en Pantalla de Éxito (`/checkout`):**
   - Corregido el renderizado de los números de tokens y la cantidad real adquirida (`tokensCreados`) para que nunca muestre `0 Tokens` tras limpiar la selección temporal.
   - Vinculación fluida del botón **"Ver mis Tokens y Comprobante"** para transferir el número del usuario a `/validar` sin necesidad de volver a digitarlo.

3. **Subida Visual de Comprobante SINPE:**
   - Incorporada vista previa fotográfica (thumbnail real) de la captura adjunta.
   - Marco de confirmación verde esmeralda con peso del archivo y botón para cambiar de foto en 1 clic.

---

## 🚀 Hito 10: Protocolización Notarial, Cláusula de Deslinde JPS y Blindaje Jurídico

1. **Cláusula de Deslinde JPS en Términos y Condiciones (`/terminos`):**
   - Agregada la sección destacada de deslinde institucional con la Junta de Protección Social (JPS) y fundamentación en la Ley N° 7472 (MEIC) y Código de Comercio.

2. **Módulo de Protocolo Notarial en Panel Admin (`/admin`):**
   - Creado el componente `ReglamentoNotarialSection.tsx` con la minuta de escritura pública protocolizable en tomo de Notario Público costarricense y engrose en papel de seguridad.
   - Herramientas de copia en 1 clic (`[ Copiar Minuta Notarial ]`) e impresión directa.

3. **Documento Maestro y PDF Ejecutivo de Estructura Legal y Comercial:**
   - Generado el documento `ESTRUCTURA_LEGAL_Y_COMERCIAL_CR.md` en la raíz del proyecto.
   - Compilado el PDF oficial `ESTRUCTURA_LEGAL_Y_COMERCIAL_CR.pdf` disponible para descarga en el navegador.

---

## 🚀 Hito 11: Cláusula de Actualización y Mejoras Continuas en Beneficio de la Comunidad

1. **En Términos y Condiciones (`/terminos`):**
   - Incorporada la sección **7. Modificaciones y Mejoras Continuas en Beneficio de la Comunidad**, estipulando la potestad de la empresa de perfeccionar bases, dinámicas y premios en favor del interés colectivo de los participantes.

2. **En Políticas de Privacidad (`/privacidad`):**
   - Incorporada la sección **5. Actualizaciones y Mejoras en Beneficio de la Comunidad**, asegurando actualización tecnológica y de seguridad conforme a la Ley N° 8968 (PRODHAB).

3. **En Minuta Notarial y Documentos Maestros (`/admin`, `.md` y `.pdf`):**
   - Incorporada la **Cláusula SÉPTIMA Notarial** en la escritura pública del Admin, en `ESTRUCTURA_LEGAL_Y_COMERCIAL_CR.md` y en el PDF oficial regenerado.

---

## 🚀 Hito 12: Rebranding Integral a "Aval Community CR", Estandarización de Marca y Configuración de Entorno

1. **Rebranding Completo de Marca a Aval Community:**
   - Actualización exhaustiva de todas las menciones, metadatos SEO (OpenGraph, títulos, PWA manifest), políticas legales, términos y condiciones, pie de página, flyers y modales de juegos express (*Raspa & Gana*, *Ruleta de la Fortuna*).
   - Estandarización de la identidad visual en todos los encabezados y barras de navegación (`AVAL COMMUNITY CR` con el texto destacado en color primario naranja) a lo largo de todas las rutas públicas (`/`, `/checkout`, `/validar`, `/login`, `/terminos`, `/privacidad`, `/reembolso`) y en la barra lateral del panel administrativo (`/admin`).
   - Actualización de identificadores comerciales, plantillas de tiquetes digitales y reportes exportables en CSV/Excel del CRM (`Reporte-Ventas-AvalCommunity`, `Tiquete-AvalCommunity-`, etc.).

2. **Configuración de Entorno de Desarrollo y Compilación:**
   - Configuración del puerto predeterminado en `3000` en `vite.config.ts` (tanto para `server` como para `preview`), liberando el puerto 5173.
   - Optimización del script de pre-renderizado HTML estático (`scripts/prerender.js`) para finalización limpia de procesos de compilación en producción.

---

## 🚀 Hito 13: Dinamización Integral de Precios Promocionales y Configuración Administrativa de SuperTokens

1. **Precios y Paquetes 100% Dinámicos:**
   - Se eliminaron todos los valores estáticos (`5000`, `1500`, etc.) del landing page (`src/routes/index.tsx`), modales de selección (`src/components/StickersModal.tsx`), checkout y tarjetas de compra.
   - El precio del paquete promocional (3 Tokens) y los paquetes escalonados ahora se calculan en tiempo real a partir del campo "Precio base por Token (₡)" configurado en `/admin` -> **Premios y Sorteo Oficial**.

2. **Panel de Configuración de SuperTokens (`/admin` -> Configuración):**
   - Agregada la sección **👑 8. Configuración de SuperTokens** en `ConfigSection.tsx` con controles para:
     - Estado del SuperToken (Activar / Pausar).
     - Precio adicional por SuperToken en colones (₡ CRC).
     - Monto del premio en efectivo en dólares ($ USD Cash extra para el 1° lugar).
   - Persistencia completa en Supabase y estado centralizado en `admin-store.ts`.

3. **Propagación en Tiempo Real en Toda la Plataforma:**
   - Actualización dinámica del bono en dólares y desglose en colones en:
     - Hero del Landing Page y tarjetas de premios.
     - Modal de selección de números (`StickersModal.tsx`).
     - Pasarela de Checkout y comprobante de pago (`checkout.tsx`).
     - Consulta y verificación de tiquetes digitales (`validar.tsx`).
     - Generador de tiquetes oficiales en Canvas PNG (`ticket-canvas.ts`).
     - Flyer promocional y módulo de escrutinio oficial (`EscrutinioSection.tsx`).

---

## 🚀 Hito 14: Corrección de Persistencia en Base de Datos y Sincronización Inmediata de Precios

1. **Corrección de Esquema en Supabase (`sorteo_config`):**
   - Corrección del nombre de columna `detalle_features` (snake_case) en `upsertSorteo`, resolviendo el error de guardado en el panel administrativo.
   - Implementación de mecanismo de reintento automático (*retry*) con campos mínimos garantizados (`id`, `nombre`, `rango_min`, `rango_max`, `precio_base`, `fecha`) para asegurar la persistencia en caso de inconsistencias en columnas secundarias.

2. **Eliminación Total de Fallbacks Estáticos:**
   - Removidos todos los fallbacks numéricos residuales (`5000`, `1000`) en `PremiosSection.tsx`, `admin-store.ts` y `src/routes/index.tsx`.
   - Priorización directa de la base de datos Supabase sobre el almacenamiento local, garantizando que los cambios de precio en el panel de administración se reflejen de inmediato en toda la aplicación.
