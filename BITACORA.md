# Bitácora del Proyecto: Aval Community CR (PWA Digital)

**Última actualización:** 10 de Septiembre de 2026 - 8:26 PM (Hito 28: Estandarización de Niveles de Premios, Dinámica de Premiación Configurable, Persistencia de Premios Inactivos en Supabase y Erradicación del Flash en Recarga)  
**Dominio Oficial:** [https://www.avalcommunity.com](https://www.avalcommunity.com)  
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
  - Dominio: `avalcommunity.com` / `www.avalcommunity.com`
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

---

## 🚀 Hito 15: Reordenamiento Automático de Premios y Persistencia Definitiva de Ficha Técnica

1. **Reordenamiento Automático e Inmediato de Premios por Nivel:**
   - Al asignar "Premio Mayor" a cualquier entrega, el sistema reubica automáticamente dicho premio en la **Posición #1** (`orden: 1`), realizando un intercambio (*swap*) ordenado con el premio anterior sin duplicar niveles.
   - "Segundo Premio" se ubica en **Posición #2** (`orden: 2`) y "Tercer Premio" en **Posición #3** (`orden: 3`).
   - Se agregaron badges visuales distintivos (`👑 1° Lugar · Premio Mayor`, `🥈 2° Lugar · Segundo Premio`, `🥉 3° Lugar · Tercer Premio`) en las tarjetas del panel administrativo.
   - La función `fetchPremios()` y `upsertPremios()` garantizan un ordenamiento determinista estricto tanto en Supabase como en la landing page.

2. **Persistencia Definitiva de Ficha Técnica y Características:**
   - Se eliminó el campo inexistente `modalidad_venta` del payload directo de `sorteo_config`, el cual provocaba el error `PGRST204` en Supabase y activaba un fallback que omitía los campos `detalle_*`.
   - Todos los campos de Ficha Técnica (`detalle_titulo`, `detalle_subtitulo`, `detalle_imagen`, `detalle_features`, `detalle_garantia`) se guardan y leen directamente en Supabase y se respaldan en `localStorage`, evitando que se restablezcan a valores anteriores al recargar la página.

---

## 🚀 Hito 16: Adaptación y Encuadre Óptimo de Imágenes de Premios y Showcase

1. **Hero Showcase de Alto Impacto Sin Recortes:**
   - Reemplazo de recorte forzado (`object-cover`) por contenedor adaptativo con `object-contain`, fondo ambiental difuminado (`blur-2xl opacity-20`) y sombras de profundidad (`drop-shadow`).
   - El vehículo o entrega principal se visualiza en su totalidad al 100% (llantas, cúpula, retrovisores, alerones) sin cortes de encuadre.

2. **Cuadrícula de Entregas y Ficha Técnica Detallada:**
   - Las 3 tarjetas de premios (Premio Mayor, Segundo y Tercer Premio) y la sección de Ficha Técnica integran contenedores fluidos que amoldan consolas (PlayStation 5), motocicletas y vehículos con proporciones reales, eliminando bordes toscos o ampliaciones artificiales.

---

## 🚀 Hito 17: Visor Lightbox y Zoom en Pantalla Completa para Fotografías de Premios

1. **Ampliación Interactiva con 1 Clic (Modal Lightbox Ultra-HD):**
   - Se implementó un visor modal a pantalla completa con soporte táctil, teclado (ESC) y cierre por clic exterior.
   - Al hacer clic en la fotografía principal del Hero Showcase, en cualquiera de las 3 tarjetas de entregas destacadas o en la Ficha Técnica, la imagen se abre en gran formato sin recortes, acompañada de su título oficial y badge de posición (1° Lugar, 2° Lugar, etc.).

2. **Indicadores de Interacción y Usabilidad Visual:**
   - Se integró cursor de lupa (`cursor-zoom-in`) y badges dinámicos con icono de zoom (`🔍 Clic para ampliar`) al pasar el cursor sobre las fotos para guiar al usuario.

---

## 🚀 Hito 18: Triple Modalidad de Venta en Admin y Destacado del Paquete Más Vendido (₡8 000)

1. **Selector de 3 Modalidades Oficiales en el Panel de Administración:**
   - **Modalidad 1 (Estándar ₡1 000/token):** 4 Tokens (₡4 000), 8 Tokens (₡8 000 - Más Popular), 12 Tokens (₡12 000) y 24 Tokens (₡24 000) con montos redondos limpios sin decimales.
   - **Modalidad 2 (Múltiplos de 3 - Competencia PRO):** Cuadrícula de 8 paquetes desde 3 hasta 24 stickers (3 por ₡4 000, 6 por ₡8 000 [EL MEJOR / MÁS VENDIDO], 9 por ₡12 000, etc.).
   - **Modalidad 3 (Paquete Único Promo Flash):** Venta directa de 1 solo paquete promocional cerrado de 3 tokens por el precio base elegido.

2. **Destacado Superior en el Hero y Coherencia de Precios:**
   - Se añadió badge dinámico superior en el Hero: `🔥 Más Popular: 6 Tokens por ₡8 000` (o `8 Tokens por ₡8 000` según modalidad activa).
   - El título principal ahora anuncia el precio de entrada real `desde solo ₡4 000` (o ₡1 000 en estándar), eliminando completamente montos quebrados como `₡1 333` o `₡5 332`.

---

## 🚀 Hito 19: Panel de Modificación Directa del SuperToken en la Sección Principal de Sorteos

1. **Campos Directos de Edición del SuperToken en Premios y Sorteo:**
   - Se integró una tarjeta dorada dedicada para el SuperToken dentro del panel principal de Sorteos (`PremiosSection`).
   - **Costo Adicional del SuperToken (₡ CRC):** Permite cambiar de inmediato el monto en colones cobrado al activar SuperToken (ej: ₡1 000 o ₡1 500).
   - **Bono Extra en Efectivo ($ USD):** Permite modificar el premio en dólares (ej: $6 000 USD Cash) que gana el 1° Lugar.
   - **Interruptor Activo/Inactivo:** Permite habilitar o deshabilitar el SuperToken con un clic.

2. **Sincronización Total con 1 Clic:**
   - Al presionar *"Guardar Fecha y Configuración"*, se guardan atómicamente la configuración del sorteo, las modalidades y el valor del SuperToken en Supabase y `localStorage`.

---

## 🚀 Hito 20: SuperToken Tarifa Plana Fija y Actualización de Dominio a www.avalcommunity.com

1. **SuperToken Tarifa Plana Fija (₡1 000 flat):**
   - Se transformó el cálculo del SuperToken en el carrito/checkout de una multiplicación proporcional a una tarifa fija única (flat fee).
   - Sin importar si el usuario compra 3, 6, 12 o 24 tokens, la activación del SuperToken cobra únicamente la tarifa plana configurada en el Admin (por defecto ₡1 000 CRC), maximizando la tasa de conversión y ventas.

2. **Actualización Completa de Dominio Oficial:**
   - Actualización de todos los generadores de comprobantes (`ticket-canvas.ts`), historias para redes (`story-canvas.ts` y `StoryShareModal.tsx`) y metadatos hacia el dominio oficial `https://www.avalcommunity.com` (con doble 'm').

3. **Migración y Despliegue en Repositorio Oficial (`juancublizcr-cmd/AvalCards`):**
   - Repositorio remoto apuntado y sincronizado al 100% con `https://github.com/juancublizcr-cmd/AvalCards`.
   - Pipeline de despliegue continuo de Vercel disparado exitosamente para el dominio `www.avalcommunity.com`.
   - Limpieza de credenciales de acceso para garantizar total seguridad en el entorno local y remoto.

---

## 🚀 Hito 21: Identidad de Marca Oficial, Isotipo Transparente y Favicon Multi-Resolución

1. **Recorte y Procesamiento de Assets de Marca:**
   - Procesamiento del isotipo oficial con fondo transparente de alta precisión (`public/isotipo.png`).
   - Actualización del logotipo institucional para versiones oscura y clara (`public/logo.png`, `public/logo-dark-text.png`).
   - Generación de toda la suite de favicons multi-resolución: `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `icons/icon-192x192.png`, `icons/icon-512x512.png` y `icons/icon.svg`.

2. **Integración Global en la Aplicación:**
   - Reemplazo del isotipo y logo en la barra de navegación pública (`IndexPage`), pie de página (`Footer`), panel lateral de administración (`AdminSidebar`), Flyer Promocional de preventa y pantalla de `Checkout`.
   - Inyección de cache-busting en `index.html` para forzar la actualización inmediata en navegadores de clientes y PWA.

---

## 🚀 Hito 22: Agente de Inteligencia Artificial Flotante Multi-Proveedor y Control en Admin

1. **Burbuja Flotante Interactiva Global (`AiAgentBubble.tsx`):**
   - Montaje global en la raíz (`__root.tsx`) accesible desde todas las rutas de la plataforma.
   - Botón flotante circular con el isotipo oficial de Aval Community CR y pulso verde "En línea".
   - Interfaz de chat glassmorphism con auto-scroll, chips de acciones rápidas (`💳 Pagar por SINPE`, `🎟️ Validar Tokens`, `⚖️ Legalidad`, `🎁 Ganar Tokens Gratis`) y enlace directo de traspaso a WhatsApp oficial con mensaje precargado.

2. **Soporte Multi-Proveedor LLM y Panel Admin (`ConfigSection.tsx`):**
   - Sección dedicada (Sección 11) en el Panel de Administración para gestionar la IA.
   - Selector de proveedor activo: **Google Gemini**, **OpenAI**, **DeepSeek** y **Anthropic Claude**.
   - Almacenamiento seguro de API keys con toggles para ocultar/mostrar claves (`Eye / EyeOff`).
   - Selector de modelo por proveedor (`gemini-1.5-flash`, `gpt-4o-mini`, `deepseek-chat`, `claude-3-5-haiku`, etc.).
   - Herramienta de testeo en vivo con botón **"Probar Conexión Activa"** (`probarConexionIA`).
   - Editor en tiempo real de mensaje de bienvenida y prompt del sistema con persistencia en Supabase.

3. **Interacción Avanzada por Voz (Web Speech API):**
   - 🎙️ **Dictado por Voz**: Integración de `SpeechRecognition` para que el usuario pueda hablarle al asistente con transcripción automática en tiempo real.
   - 🔊 **Lectura en Voz Alta (Text-to-Speech)**: Botón de altavoz en cada respuesta para escuchar las respuestas habladas en español con síntesis de voz nativa.

---

## 🚀 Hito 23: Aval-IA como Cerrador de Ventas Proactivo y Base de Conocimiento Total de la Plataforma

1. **Identidad y Rol Comercial de Alto Rendimiento:**
   - Bautizado oficialmente como **Aval-IA**, configurado con amabilidad costarricense ("pura vida") pero con mentalidad de cerrador de tratos (sales closer).
   - Enfoque exclusivo de atención al público: cada respuesta conduce estratégicamente al cierre mediante preguntas de alternativa ("¿prefieres 8 o 12 tokens?") y llamados a la acción directos al [Checkout](/checkout) o al SINPE Móvil oficial al `8634-4772`.

2. **Blindaje de Seguridad y Protección Anti-Técnica:**
   - Interceptor en código (`esConsultaTecnicaInterna`) y directrices estrictas en el prompt que bloquean cualquier consulta sobre código, frameworks, Supabase, arquitectura o cómo fue desarrollada la plataforma.
   - Desvío cordial automático que aclara que su función es 100% comercial y redirige de inmediato a las opciones de compra de tokens.

3. **Enciclopedia y Dominio Total de la Plataforma (LLM y Motor Offline):**
   - **6 Métodos de Pago**: SINPE Móvil Oficial al `8634-4772` (Importadora Luxury Scents LTDA.), Tarjetas Débito/Crédito TiloPay con aprobación instantánea automática, Apple Pay, Google Pay, PayPal y Criptomonedas (USDT redes TRC20/BEP20 o Binance Pay).
   - **Lotes de Tickets**: 4 Tokens (₡4,000), 8 Tokens (₡8,000 - Más Popular), 12 Tokens (₡12,000) y 24 Tokens (₡24,000 VIP) con selección libre de combinaciones de 5 dígitos (00000 al 99999) o generadas al azar.
   - **SuperToken ($6,000 USD Cash Extra)**: Multiplicador opcional por ₡1,500 en Checkout que otorga $6,000 USD en efectivo adicionales si el participante gana el 1° lugar.
   - **Premios Oficiales**: Toyota Prado 2026 0KM full extras 4x4 (traspaso notarial y marchamo 100% pagos por la empresa), Moto Yamaha MT 0KM, PlayStation 5 o ₡1,000,000 SINPE, y juegos express con premios instantáneos de hasta ₡100,000.
   - **Mini-Sorteos Semanales "Viernes de Tanque Lleno"**: ₡50,000 en combustible Delta/Uno (o SINPE equivalente) rifados todos los viernes automáticamente entre todos los participantes activos, sin pagar nada extra y manteniendo sus números activos para la Prado.
   - **Dominio de FAQs Oficiales**: Respuestas exactas sobre participación, determinación transparente de ganadores con la **Lotería Nacional de la Junta de Protección Social (JPS)**, validación en `/validar` y traspaso legal formal ante Notario Público bajo la Ley N° 7472.
   - **Ganchos de Venta Incitadores**: Integración sistemática en saludos y respuestas para despertar emoción (*"¡mira te ganas gasolina todos los viernes con tanque lleno!", "¿sabes de los supertokens?"*).

---

## 🚀 Hito 24: Desacoplamiento de Flotantes Inferiores, Visibilidad de Contraseña en Login y Auditoría Operativa

1. **Desacoplamiento y Reorganización de Elementos Flotantes Inferiores:**
   - Corrección del solapamiento entre el banner de instalación PWA (`PwaInstallPrompt.tsx`), la burbuja flotante del asistente inteligente (`AiAgentBubble.tsx`) y las alertas en vivo de compras (`FomoNotifications.tsx`).
   - `PwaInstallPrompt`: Reposicionado a `bottom-22 left-3 right-3 sm:left-auto sm:bottom-6 sm:right-24 z-40 max-w-md`, garantizando total visibilidad y acceso táctil a los botones de "Instalar" y cerrar ("✕") tanto en dispositivos móviles como en pantallas de escritorio sin chocar con la burbuja de la IA.
   - `FomoNotifications`: Limitado en ancho (`max-w-[calc(100%-5.5rem)]` en móvil y `sm:bottom-6 sm:left-6 sm:max-w-xs` en PC) para convivir fluidamente con el resto de componentes.
   - Eliminación de llamada redundante `<InstallPWA />` en `__root.tsx` y ajuste de elevación de botones de acción rápida en `index.tsx`.

2. **Seguridad y Usabilidad en Login Administrativo (`src/routes/login.tsx`):**
   - Incorporación de botón interactivo de alternancia de visibilidad de contraseña (ícono de ojito `Eye` / `EyeOff` con Lucide React).
   - Espaciado optimizado (`pl-9 pr-10`) para prevenir sobreescritura de texto sobre los iconos de candado y visibilidad.

3. **Auditoría Integral y Checklist Operativo de Producción:**
   - Verificación de la consola administrativa (`/admin`) y persistencia de pasarelas de pago (SINPE Móvil, TiloPay, PayPal, Cripto).
   - Comprobación del ciclo de vida de compilación limpia de Vite/PWA (`dist/`) y sincronización automática con Vercel Edge Network.

---

## 🚀 Hito 25: Dinámica Real de Selección de Vehículos, Subaru Impreza WRX, Cuadrícula Auto-Adaptable y Compatibilidad con Supabase

1. **Dinámica Real de Elección de Vehículos y Flexibilidad Multi-Vehículo:**
   - Implementación de la regla comercial oficial:
     - **1° Lugar (A Elección)**: El ganador escoge su favorito entre la **Moto de Alta Cilindrada ($57,900)**, el **Mercedes-Benz Clase GLE ($30,000)** o el **Subaru Impreza WRX**.
     - **2° Lugar (Restante)**: Se adjudica el vehículo restante no elegido por el 1° lugar.
     - **3° Lugar (Efectivo)**: Premio en efectivo garantizado o PlayStation 5.
   - Ajuste en el selector administrativo para permitir que varios vehículos compartan la condición de `1° Lugar (A Elección)` simultáneamente sin forzar intercambios destructivos.

2. **Integración Fotográfica Oficial del Subaru Impreza WRX:**
   - Generación e incorporación del recurso visual en alta resolución con iluminación de estudio showroom (`src/assets/premio-subaru.jpg` y `public/premio-subaru.jpg`).
   - Soporte para ampliación y zoom en modal de alta definición al hacer clic desde las tarjetas de premios.
   - Inserción directa y vinculación del nuevo registro en la tabla `premios` de Supabase (`p_subaru_impreza`).

3. **Cuadrícula Auto-Adaptable Inteligente en la Landing Page (`/`):**
   - Transformación de la grilla de premios rígida a una cuadrícula dinámica que se recalcula automáticamente según la cantidad de entregas activas:
     - **1 entrega**: Columna centralizada destacada (`max-w-md mx-auto`).
     - **2 entregas**: Distribución simétrica balanceada de 2 columnas (`grid-cols-2`).
     - **3 entregas**: Cuadrícula de 3 columnas (`grid-cols-3`).
     - **4 o más entregas**: Cuadrícula responsive de 4 columnas (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`).
   - Títulos y subtítulos de sección auto-generados dinámicamente según la cantidad visible (*"Gran Entrega Destacada"*, *"Dos Entregas Espectaculares"*, *"Tres Entregas Espectaculares"*, *"Cuatro Entregas de Lujo"*).
   - El Hero Showcase principal detecta automáticamente el primer vehículo activo para evitar caídas o espacios en blanco si un vehículo es desactivado.
   - Badges visuales con código cromático premium (`1° Lugar · A Elección` en oro, `2° Lugar · Restante` en azul eléctrico, `3° Lugar · Efectivo` en esmeralda).

4. **Interruptores Activo / Oculto en Tiempo Real (`/admin`):**
   - Agregado switch individual para cada entrega en el panel de administración para conectar o desconectar premios de la landing page al instante sin tener que borrarlos de la base de datos.
   - Ampliación del límite de entregas de 3 a 8 en el administrador.

5. **Resolución de Restricción SQL (`CHECK constraint`) en Supabase:**
   - Diagnóstico del error `violates check constraint "premios_nivel_check"` originado por la restricción nativa de PostgreSQL en la columna `nivel` (`IN ('Premio Mayor', 'Segundo Premio', 'Tercer Premio')`).
   - Implementación de capa de normalización (`toSupabaseNivel`) que mapea de forma transparente los niveles a los valores aceptados por Supabase mientras almacena los niveles reales y estados activos en metadatos y memoria.
   - Corrección de sintaxis de cierre JSX en `PremiosSection.tsx`.
   - Limpieza exhaustiva de menciones obsoletas a "Toyota Prado" en textos, SEO, metatags y base de conocimientos de Aval-IA.
   - Compilación completa validada (`npm run build` y pre-renderizado HTML) y despliegue exitoso en GitHub y Vercel Edge.

---

## 🚀 Hito 26: Corrección Definitiva de Zona Horaria UTC-6, Cierre Automático de Ventas 2h Antes, Sanitización Legal y Simulador de Estados

1. **Biblioteca Central de Fechas y Neutralización del Bug UTC (`src/lib/fecha-utils.ts`):**
   - Eliminación radical del bug de corrimiento de fechas causado por instanciación `new Date("YYYY-MM-DD")` que interpretaba medianoche UTC y restaba 6 horas en Costa Rica (UTC-6), mostrando 1 día menos en el contador.
   - Construcción de funciones normalizadas: `extraerFechaLocal`, `normalizarHora`, `fechaSorteoATimestamp`, `formatearFechaLarga` y `formatearHora12` para calcular siempre la hora local exacta concatenando `T[HH:mm]:00`.

2. **Lógica de Horarios Oficiales y Cierre Previo de 2 Horas (Opción B):**
   - **Horarios Oficiales**: Martes y Viernes a las 7:30 PM (19:30), Domingos a las 7:30 PM (19:30).
   - **Cierre Automático**: Bloqueo total de ventas y checkout exactamente **2 horas antes** de la hora de la emisión (a las 5:30 PM / 17:30).
   - Función `obtenerEstadoSorteo`: Calcula en tiempo real si el sorteo está en `VENTAS_ABIERTAS`, `CIERRE_PREVIO` (2h antes), `EN_CURSO` (transmisión en vivo a partir de las 7:30 PM) o `FINALIZADO`.

3. **Sanitización de Términos Prohibidos:**
   - Erradicación total de las palabras prohibidas *"lotería"* y *"chances"* en toda la plataforma pública, el panel de administración, la base de datos y los términos legales.
   - Reemplazo por terminología autorizada y neutral: *"Emisión Oficial de la JPS"*, *"Sorteo Oficial JPS"*, *"Tokens Oficiales"* y *"Auditoría Notarial bajo Emisión Pública"*.

4. **Simulador de Estados del Sorteo en Tiempo Real (`/admin` -> Configuración):**
   - Integración de panel interactivo de pruebas en la sección de Configuración para testear la respuesta de la web sin esperar las horas reales:
     - ⚡ **Automático Real**: Sigue la hora del reloj del sistema.
     - 🟢 **Ventas Abiertas**: Modo estándar con compras y botones 100% habilitados.
     - 🔒 **Cierre 2h Antes**: Bloquea compras, muestra banner de cierre en la landing page y desactiva el formulario de Checkout.
     - 🎯 **Sorteo en Vivo**: Activa el distintivo en vivo de emisión en curso a las 7:30 PM.
   - Enlaces directos a Landing y Checkout para previsualización inmediata en nuevas pestañas.

5. **Guardias de Seguridad y Protección en Checkout (`/checkout`):**
   - Detección reactiva de estado de ventas cerradas.
   - Desactivación de pasarelas de pago y presentación de tarjeta informativa de bloqueo con candado cuando restan 2 horas para la emisión.

6. **Compilación de Producción y Pre-renderizado:**
   - Verificación de imports (`useState`, `Flame`, `fecha-utils`), compilación limpia con Rolldown/Vite SSR y generación de estáticos HTML sin errores.

---

## 🚀 Hito 27: Sistema Integral de Sponsors, Cooldown Semanal Antifraude, Aprobación de Solicitudes, Diferenciación de Destacados y Gestor de Servicios por Etiquetas

1. **Control Antifraude y Cooldown Semanal Configurable (`/sponsors` y `/comercio`):**
   - Incorporación del campo configurable `diasIntervaloCanje` (por defecto 7 días) por cada comercio aliado en el panel de administración.
   - Verificación preventiva en tiempo real al ingresar el teléfono del cliente:
     - Bloquea canjes duplicados dentro del intervalo de espera reglamentario.
     - Mensaje limpio y directo con la fecha exacta de desbloqueo: *"⏳ Próximo canje disponible a partir del [fecha]. Ya utilizaste tu beneficio el [fecha] ([servicio]). Por política de frecuencia, se permite 1 canje cada semana por usuario."*
   - Protección en la Mini-App del comercio (`/comercio`): Alerta ámbar informativa en el Paso 1 y pantalla de bloqueo preventivo en el Paso 2 con botón de excepción manual autorizado para el encargado del negocio.

2. **Flujo de Aprobación y Depuración de Solicitudes de Afiliación (`/admin`):**
   - Los negocios que completan el formulario público en `/sponsors#afiliarse` se registran en la base de datos Supabase (`sorteo_config` y `solicitudes_sponsors`).
   - El administrador visualiza las solicitudes en la pestaña **Solicitudes de Afiliación** con badge indicador parpadeante cuando hay pendientes.
   - Botón **"Aprobar y Crear Comercio"**: Pre-carga de forma instantánea todos los datos de la solicitud en el modal de creación.
   - Al guardar el comercio exitosamente, el sistema marca automáticamente la solicitud como `"aprobado"` y la retira de la lista de pendientes para evitar duplicidades.

3. **Gestor Interactivo de Servicios y Productos con Descuento (Chips / Tags):**
   - Erradicación definitiva del problema de tipeo donde los espacios y comas se eliminaban en cada pulsación.
   - Nuevo sistema de etiquetas dinámicas:
     - Entrada de texto libre con soporte completo para espacios.
     - Inserción individual o por lote con separación por comas al presionar **`Enter`** o hacer clic en **`+ Agregar`**.
     - Badges visuales dorados individuales con botón **`✕`** para remover servicios en un toque.
     - Auto-captura de texto pendiente en el campo al presionar "Guardar Comercio".
     - Validación estricta que exige al menos un servicio registrado antes de permitir guardar el comercio.

4. **Diferenciación Visual Comercial entre Destacados y Aliados Estándar (`/sponsors`):**
   - División del catálogo público para valorizar el patrocinio premium:
     - **⭐ Comercios Destacados**: Presentación superior prioritaria con tarjeta expandida completa, badge TOP SPONSOR dorado, resplandor lumínico y botones de acción rápida.
     - **🏬 Otros Comercios Aliados**: Agrupados de forma compacta en un acordeón desplegable que no resta protagonismo a los patrocinadores destacados.
   - **Llamado de atención animado**:
     - Animación de parpadeo suave (`animate-pulse`) en el título y la insignia de conteo de comercios disponibles.
     - Faro o beacon luminoso (`animate-ping`) para captar la mirada del usuario e invitar a desplegar el listado completo sin pasar desapercibido.

5. **Verificación de Compilación y Despliegue:**
   - Verificación de tipos TypeScript, compilación exitosa en Rolldown/Vite SSR, pre-renderizado completo de rutas estáticas HTML y despliegue a producción en Vercel Edge.

---

## 🚀 Hito 28: Estandarización de Niveles de Premios, Dinámica de Premiación Configurable, Persistencia de Premios Inactivos en Supabase y Erradicación del Flash en Recarga (SSR/Hydration)

1. **Estandarización de Niveles y Eliminación de Términos Redundantes ("A Elección"):**
   - Eliminación formal de sufijos confusos como `"(A Elección)"` y `"(Efectivo)"` en selectores, etiquetas, insignias y textos del sistema.
   - Definición limpia y unificada de los 4 niveles oficiales: `"1° Lugar"`, `"2° Lugar"`, `"3° Lugar"` y `"Premio Extra"`.
   - Implementación de mapeos retrocompatibles transparentes para normalizar registros previos existentes en base de datos.
   - Actualización de badges e insignias oficiales en tarjetas: `👑 1° Lugar`, `🥈 2° Lugar`, `🥉 3° Lugar` y `⭐ Premio Extra`.
   - Sanitización del prompt del Asesor IA (`Aval-IA`) y de las cláusulas legales por defecto para mantener congruencia comercial absoluta.

2. **Corrección de Estilos y Contraste en Barra de SuperToken / Moneda:**
   - Corrección de clases rígidas oscuras (`bg-zinc-950/80`) que provocaban problemas de contraste en modo claro en el componente `PremiosSection`.
   - Reemplazo por estilos semánticos y adaptables al tema activo (`bg-secondary/30`, `border-border/70`, `text-foreground`).

3. **Dinámica de Premiación 100% Configurable desde el Admin (`/admin` -> Premios):**
   - Incorporación del switch `mostrarDinamica` (Visible / Oculto) en el esquema del Sorteo para permitir prender o apagar el banner de Dinámica Oficial a voluntad.
   - Asistente inteligente `🪄 Auto-componer con activos`: redacta automáticamente la regla oficial basándose estrictamente en los premios que se encuentran activos.
   - Corrección de reseteo involuntario: borrar el campo de regla ya no resucita textos por defecto obsoletos.

4. **Filtrado Automático de Premios Apagados en la Dinámica Oficial:**
   - Lógica reactiva en `textoDinamicaFinal` de la landing page (`src/routes/index.tsx`).
   - Si la regla configurada menciona vehículos o premios que el administrador apagó (como Mercedes-Benz o PlayStation 5), el sistema detecta la inconsistencia y recompone automáticamente el texto oficial utilizando únicamente los premios activos.

5. **Persistencia Remota de Premios Apagados en Supabase (`_premios_meta`):**
   - Ante la ausencia de una columna `activo` en la tabla `premios` de Supabase, se implementó almacenamiento estructurado en `sorteo_config.raspa_config._meta._premios_meta`.
   - Sincronización bidireccional en `upsertPremios` y preservación estricta en `upsertSorteo` y `upsertConfig` para evitar pérdidas de estado.
   - Estado persistido y verificado en la base de datos remota:
     - `p1788407187381` (Moto alta cilindrada) &rarr; `activo: true`
     - `p_subaru_impreza` (Subaru Impreza WRX) &rarr; `activo: true`
     - `p1788406851660` (Mercedes-Benz Clase GLE) &rarr; `activo: false` (Oculto)
     - `p1788407321054` (PlayStation 5) &rarr; `activo: false` (Oculto)
     - `p1789091239712` (₡4.000.000 de colones) &rarr; `activo: true`

6. **Erradicación del Flash / Parpadeo de Premios al Refrescar la Página:**
   - **Causa raíz eliminada**: Durante el Server Side Rendering (SSR) y render inicial de TanStack Start, la falta de `_premios_meta` en la consulta remota generaba HTML con todos los 5 premios, y tras la hidratación en cliente el `useEffect` ocultaba los 2 inactivos, produciendo un salto visual tosco.
   - **Solución implementada**:
     - `fetchPremios` consulta prioritariamente `_premios_meta` en Supabase tanto en servidor (SSR) como en cliente.
     - Inicialización perezosa de `premios` en `src/routes/index.tsx` con verificación anticipada de `localStorage` para garantizar 0 milisegundos de desfase.
     - Comparación de firmas en el `useEffect` para impedir re-renderizados innecesarios.
   - **Verificación**: Validación directa del HTML emitido por el servidor: entrega directamente **"Tres Entregas Espectaculares"** con cuadrícula de 3 columnas (`md:grid-cols-3`) y regla oficial limpia desde el primer frame, sin saltos visuales ni parpadeos.

