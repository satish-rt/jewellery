const http = require('http');

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
    console.log('Login status', loginRes.statusCode);
    console.log('Headers:', loginRes.headers);
    const setCookie = loginRes.headers['set-cookie'];
    if (!setCookie || setCookie.length === 0) {
      console.error('No set-cookie header received; login likely failed. Body:', loginRes.body);
      process.exit(1);
    }
    const cookie = setCookie[0].split(';')[0];
    console.log('Using cookie:', cookie);

    // Call delete image
    const productId = '6a9d11cb42745506960abaff'; // Aurora Signet Ring
    const url = encodeURIComponent('/images/hero-poster.png');
    console.log('Requesting DELETE /api/products/' + productId + '/images?url=' + url);
    const delRes = await request({ hostname: SERVER.host, port: SERVER.port, path: `/api/products/${productId}/images?url=${url}`, method: 'DELETE', headers: { Cookie: cookie } });
    console.log('Delete status', delRes.statusCode);
    console.log('Delete body:', delRes.body);
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
