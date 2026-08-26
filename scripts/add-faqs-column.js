import https from "node:https";

const query = `
ALTER TABLE sorteo_config 
ADD COLUMN IF NOT EXISTS faqs jsonb DEFAULT '[
  {
    "pregunta": "¿Cómo participo en el evento promocional?",
    "respuesta": "Elige el paquete de Tokens digitales de tu preferencia (4, 8, 12 o 24 Tokens). Puedes dejar que el sistema asigne tus números de cortesía al azar o escribir tus números favoritos de 5 dígitos. Luego completas tus datos y pagas por SINPE Móvil o Tarjeta."
  },
  {
    "pregunta": "¿Cómo se determinan los favorecidos?",
    "respuesta": "El evento se rige formalmente por combinaciones matemáticas transparentes basadas en los resultados oficiales públicos en la fecha establecida, garantizando total claridad e imparcialidad para todos los participantes."
  },
  {
    "pregunta": "¿Qué hago después de realizar el pago?",
    "respuesta": "Si pagas con Tarjeta de Débito/Crédito, tu orden se valida al instante de forma automática. Si pagas por SINPE Móvil, nuestro equipo valida la transferencia en pocos minutos. Puedes consultar el estado de tus Tokens en la sección ''Validar mis Tokens''."
  },
  {
    "pregunta": "¿Qué son las Entregas Instantáneas?",
    "respuesta": "Al adquirir tus Tokens, si uno de tus números coincide con una combinación favorecida pre-establecida en el evento, ¡obtienes ese reconocimiento menor al instante de forma automática!"
  },
  {
    "pregunta": "¿Cómo se realiza la entrega del vehículo o beneficio principal?",
    "respuesta": "La entrega se realiza de forma presencial con firma formal de traspaso legal ante Notario Público. Todos los costos de traspaso, marchamo y derechos corren por cuenta de Aval Motors CR e Importadora Luxury Scents LTDA."
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
