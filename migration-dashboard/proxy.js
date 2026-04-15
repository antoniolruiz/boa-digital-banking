/**
 * Local CORS proxy for the Devin API.
 * Runs on http://localhost:4203 and forwards /devin/* → https://api.devin.ai/v1/*
 *
 * Usage: node proxy.js
 */

const http = require('http');
const https = require('https');

const PORT = 4203;
const DEVIN_HOST = 'api.devin.ai';

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Strip leading /devin prefix if present, forward the rest
  const targetPath = '/v1' + req.url.replace(/^\/devin/, '');

  const options = {
    hostname: DEVIN_HOST,
    port: 443,
    path: targetPath,
    method: req.method,
    headers: {
      ...req.headers,
      host: DEVIN_HOST,
    },
  };

  const proxy = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, {
      ...proxyRes.headers,
      'Access-Control-Allow-Origin': '*',
    });
    proxyRes.pipe(res, { end: true });
  });

  proxy.on('error', (err) => {
    console.error('Proxy error:', err.message);
    res.writeHead(502);
    res.end('Proxy error: ' + err.message);
  });

  req.pipe(proxy, { end: true });
});

server.listen(PORT, () => {
  console.log(`Devin CORS proxy running at http://localhost:${PORT}`);
  console.log(`Forwarding: http://localhost:${PORT}/* → https://${DEVIN_HOST}/v1/*`);
});
