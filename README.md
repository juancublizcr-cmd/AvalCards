# Aval Motors CR - Rifas Digitales (PWA)

Plataforma moderna de rifas y stickers digitales construida con React, TanStack Start/Router, TailwindCSS y Supabase.

## Características

- **PWA 100% Instalable y Offline**: Soporte Service Worker (Workbox), manifest, banner de instalación, responsive mobile-first.
- **Supabase Backend**: 
  - Gestión de órdenes con estado `pendiente`, `aprobada`, `rechazada`.
  - Configuración dinámica del sorteo y sitio.
  - Gestión de inventario de números.
  - Premios instantáneos aleatorios con animación de confeti.
  - Almacenamiento de comprobantes SINPE y fotos de premios en Supabase Storage.
- **Validación de Stickers**: Consulta rápida en tiempo real por número telefónico.
- **Panel Administrativo CRM**:
  - Resumen métrico y ventas reales.
  - Verificación y aprobación manual de depósitos SINPE.
  - Algoritmo de escrutinio oficial JPS.
  - Gestión de clientes.

## Configuración y Variables de Entorno

Crear un archivo `.env` con:

```env
VITE_SUPABASE_URL="https://tu-proyecto.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="tu-anon-key"
```

## Ejecución

```bash
bun install
bun run dev
```
