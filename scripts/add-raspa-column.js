import https from "node:https";

const query = `
ALTER TABLE sorteo_config 
ADD COLUMN IF NOT EXISTS raspa_config jsonb DEFAULT '{
  "activo": true,
  "precio": 1000,
  "titulo": "Raspa y Gana Express",
  "subtitulo": "¡Gana dinero en SINPE Móvil y premios al instante con tu dedo o mouse!",
  "premios": [
    { "id": "r1", "nombre": "₡100,000 en SINPE Móvil", "icono": "💵", "probabilidad": 5, "esGanador": true },
    { "id": "r2", "nombre": "₡50,000 en SINPE Móvil", "icono": "💵", "probabilidad": 10, "esGanador": true },
    { "id": "r3", "nombre": "₡20,000 en SINPE Móvil", "icono": "💵", "probabilidad": 15, "esGanador": true },
    { "id": "r4", "nombre": "12 Tokens Oficiales", "icono": "🎟️", "probabilidad": 20, "esGanador": true },
    { "id": "r5", "nombre": "SuperToken VIP Gratis", "icono": "👑", "probabilidad": 20, "esGanador": true },
    { "id": "r6", "nombre": "¡Casi lo logras! Sigue Intentando", "icono": "⚡", "probabilidad": 30, "esGanador": false }
  ]
}'::jsonb;
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
