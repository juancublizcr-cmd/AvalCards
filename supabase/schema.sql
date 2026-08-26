-- ============================================================
-- Aval Motors CR – Schema completo en Supabase
-- Ejecutar en SQL Editor de tu proyecto Supabase
-- ============================================================

-- ── 1. Tabla ordenes ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ordenes (
  id               TEXT PRIMARY KEY,
  nombre           TEXT NOT NULL,
  telefono         TEXT NOT NULL,
  email            TEXT NOT NULL,
  cantidad         INTEGER NOT NULL,
  precio           INTEGER NOT NULL,
  numeros          TEXT[] NOT NULL DEFAULT '{}',
  comprobante_url  TEXT,
  estado           TEXT NOT NULL DEFAULT 'pendiente'
                     CONSTRAINT ordenes_estado_check
                     CHECK (estado IN ('pendiente', 'aprobada', 'rechazada')),
  fecha            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 2. Tabla premios ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS premios (
  id      TEXT PRIMARY KEY,
  nombre  TEXT NOT NULL,
  nivel   TEXT NOT NULL
            CONSTRAINT premios_nivel_check
            CHECK (nivel IN ('Premio Mayor', 'Segundo Premio', 'Tercer Premio')),
  imagen  TEXT NOT NULL DEFAULT '',
  orden   INTEGER NOT NULL DEFAULT 0
);

-- Valores por defecto (las imágenes se actualizan desde el admin)
INSERT INTO premios (id, nombre, nivel, imagen, orden) VALUES
  ('p1', 'Toyota Prado',           'Premio Mayor',   '', 1),
  ('p2', 'Moto alta cilindrada',   'Segundo Premio', '', 2),
  ('p3', 'PlayStation 5',          'Tercer Premio',  '', 3)
ON CONFLICT (id) DO NOTHING;

-- ── 3. Tabla sorteo_config (singleton id=1) ───────────────────
CREATE TABLE IF NOT EXISTS sorteo_config (
  id          INTEGER PRIMARY KEY DEFAULT 1,
  nombre      TEXT NOT NULL DEFAULT 'Sorteo JPS Aval Motors CR',
  rango_min   TEXT NOT NULL DEFAULT '00000',
  rango_max   TEXT NOT NULL DEFAULT '99999',
  precio_base INTEGER NOT NULL DEFAULT 1000,
  fecha       TEXT NOT NULL DEFAULT '',
  CONSTRAINT sorteo_config_singleton CHECK (id = 1)
);

INSERT INTO sorteo_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ── 4. Tabla site_config (singleton id=1) ─────────────────────
CREATE TABLE IF NOT EXISTS site_config (
  id              INTEGER PRIMARY KEY DEFAULT 1,
  intentos_max    INTEGER NOT NULL DEFAULT 5,
  telefono_sinpe  TEXT NOT NULL DEFAULT '8888-8888',
  razon_social    TEXT NOT NULL DEFAULT 'Aval Motors CR S.A.',
  ventas_activas  BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT site_config_singleton CHECK (id = 1)
);

INSERT INTO site_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ── 5. Tabla premios_instantaneos ─────────────────────────────
CREATE TABLE IF NOT EXISTS premios_instantaneos (
  numero  TEXT PRIMARY KEY,
  premio  TEXT NOT NULL
);

-- ── 6. Tabla inventario (singleton id=1) ──────────────────────
CREATE TABLE IF NOT EXISTS inventario (
  id          INTEGER PRIMARY KEY DEFAULT 1,
  total       INTEGER NOT NULL DEFAULT 0,
  disponibles INTEGER NOT NULL DEFAULT 0,
  fecha       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT inventario_singleton CHECK (id = 1)
);

INSERT INTO inventario (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================

-- ordenes: cualquier visitante puede insertar (anon), solo service_role puede leer/actualizar
ALTER TABLE ordenes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_ordenes" ON ordenes
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_read_own_ordenes" ON ordenes
  FOR SELECT TO anon USING (true); -- el cliente filtra por teléfono en código

CREATE POLICY "service_update_ordenes" ON ordenes
  FOR UPDATE TO service_role USING (true);

-- premios: lectura pública, escritura solo service_role
ALTER TABLE premios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_premios" ON premios
  FOR SELECT TO anon USING (true);

CREATE POLICY "service_write_premios" ON premios
  FOR ALL TO service_role USING (true);

-- sorteo_config: lectura pública
ALTER TABLE sorteo_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_sorteo_config" ON sorteo_config
  FOR SELECT TO anon USING (true);

CREATE POLICY "service_write_sorteo_config" ON sorteo_config
  FOR ALL TO service_role USING (true);

-- site_config: lectura pública
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_site_config" ON site_config
  FOR SELECT TO anon USING (true);

CREATE POLICY "service_write_site_config" ON site_config
  FOR ALL TO service_role USING (true);

-- premios_instantaneos: lectura pública
ALTER TABLE premios_instantaneos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_instantaneos" ON premios_instantaneos
  FOR SELECT TO anon USING (true);

CREATE POLICY "service_write_instantaneos" ON premios_instantaneos
  FOR ALL TO service_role USING (true);

-- inventario: lectura pública
ALTER TABLE inventario ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_inventario" ON inventario
  FOR SELECT TO anon USING (true);

CREATE POLICY "service_write_inventario" ON inventario
  FOR ALL TO service_role USING (true);

-- ============================================================
-- Storage bucket para comprobantes SINPE
-- (Ejecutar solo si no existe el bucket)
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
  VALUES ('comprobantes', 'comprobantes', true)
  ON CONFLICT (id) DO NOTHING;

-- Permitir que cualquier usuario autenticado o anon suba comprobantes
CREATE POLICY "anon_upload_comprobantes" ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (bucket_id = 'comprobantes');

CREATE POLICY "anon_read_comprobantes" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'comprobantes');
