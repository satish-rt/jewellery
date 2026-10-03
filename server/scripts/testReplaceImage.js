const http = require('http');
const fs = require('fs');
const path = require('path');

const SERVER = { host: 'localhost', port: 5000 };

function request(opts, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(opts, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function run() {
  try {
    console.log('Logging in as admin...');
    const loginBody = JSON.stringify({ email: 'satishrathod08200@gmail.com', password: 'Satish@123' });
    const loginRes = await request({ hostname: SERVER.host, port: SERVER.port, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginBody) } }, loginBody);
    const setCookie = loginRes.headers['set-cookie'];
    if (!setCookie || setCookie.length === 0) {
      console.error('Login failed:', loginRes.body);
      return;
    }
    const cookie = setCookie[0].split(';')[0];

    const productId = '6a9d11cb42745506960abaff';
    const filePath = path.resolve(__dirname, '..', '..', 'client', 'public', 'images', 'hero.png');
    if (!fs.existsSync(filePath)) {
      console.error('Image file not found:', filePath);
      return;
    }
    const fileBuffer = fs.readFileSync(filePath);
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const header = `--${boundary}\r\nContent-Disposition: form-data; name="images"; filename="hero.png"\r\nContent-Type: image/png\r\n\r\n`;
    const footer = `\r\n--${boundary}--\r\n`;
    const bodyBuffer = Buffer.concat([Buffer.from(header, 'utf8'), fileBuffer, Buffer.from(footer, 'utf8')]);

    console.log('Uploading new image via PUT...');
    const putRes = await request({ hostname: SERVER.host, port: SERVER.port, path: `/api/products/${productId}`, method: 'PUT', headers: { Cookie: cookie, 'Content-Type': `multipart/form-data; boundary=${boundary}`, 'Content-Length': bodyBuffer.length } }, bodyBuffer);
    console.log('PUT status', putRes.statusCode);
    console.log('PUT body', putRes.body);
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
