import https from "node:https";

const query = `
ALTER TABLE sorteo_config 
ADD COLUMN IF NOT EXISTS detalle_titulo text DEFAULT 'Toyota Prado 2026: Lujo, Potencia y Confort',
ADD COLUMN IF NOT EXISTS detalle_subtitulo text DEFAULT 'Un vehículo 0 kilómetros, sacado de agencia con garantía total de fábrica y entregado formalmente a tu nombre.',
ADD COLUMN IF NOT EXISTS detalle_imagen text DEFAULT '',
ADD COLUMN IF NOT EXISTS detalle_features jsonb DEFAULT '[
  {"titulo": "Motor Turbo Diésel 2.8L", "desc": "Potencia brutal y máxima eficiencia en carretera."},
  {"titulo": "Tracción 4x4 Real", "desc": "Capacidad todoterreno para cualquier rincón del país."},
  {"titulo": "Versión Full Extras", "desc": "Asientos en cuero, techo panorámico y pantallas táctiles."},
  {"titulo": "100% Legal y Traspaso Incluido", "desc": "Cero gastos ocultos: marchamo y notario pagos."}
]'::jsonb,
ADD COLUMN IF NOT EXISTS detalle_garantia text DEFAULT 'Si resultas favorecido, nos encargamos de todo el trámite de traspaso notarial, placas, marchamo del año y entrega con tanque lleno.';
`;

const data = JSON.stringify({ query });

const req = https.request({
  hostname: 'api.supabase.com',
  path: '/v1/projects/zdyygdivjhftirykvjjk/database/query',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.SUPABASE_ACCESS_TOKEN || ''}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
