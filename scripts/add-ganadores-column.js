import https from "node:https";

const query = `
ALTER TABLE sorteo_config 
ADD COLUMN IF NOT EXISTS ganadores_testimonios jsonb DEFAULT '[
  {
    "id": "g1",
    "premio": "Toyota Hilux 4x4",
    "ganador": "Esteban Morales V.",
    "ciudad": "San José, Escazú",
    "sticker": "41982",
    "sorteo": "Edición #14 - Agosto",
    "foto": "",
    "testimonio": "Compré el paquete de 12 stickers por SINPE Móvil y no lo podía creer cuando me llamaron. ¡100% legal y transparente!"
  },
  {
    "id": "g2",
    "premio": "Yamaha MT-09",
    "ganador": "Valeria Campos R.",
    "ciudad": "Alajuela, San Ramón",
    "sticker": "80214",
    "sorteo": "Edición #13 - Julio",
    "foto": "",
    "testimonio": "Todo el proceso fue rápido, validaron mi depósito en menos de 10 minutos y la entrega fue formal con traspaso incluido."
  }
]'::jsonb;
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
