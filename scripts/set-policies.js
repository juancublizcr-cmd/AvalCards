import https from "node:https";

const query = `
CREATE POLICY "Public Access Premios" ON storage.objects FOR SELECT USING (bucket_id = 'premios');
CREATE POLICY "Public Insert Premios" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'premios');
CREATE POLICY "Public Update Premios" ON storage.objects FOR UPDATE USING (bucket_id = 'premios');
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
