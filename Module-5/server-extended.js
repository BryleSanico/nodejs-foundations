// server-extended.js
/*
EXERCISE: 5.2 — Add Routes to the Server
Copy server.js to server-extended.js. Add three new routes:

• GET /about — returns { name: 'My First Server', version: '1.0.0' }
• GET /time — returns { now: <current ISO timestamp> }
• GET /echo?message=hello — returns { echo: 'hello' } (parse the query string from req.url — hint: use the URL class)

Run it and test each route with Bruno.

*/

const http = require('http');
 
const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  const url = new URL(req.url, `http://${req.headers.host}`);
 
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello from Node.js!' }));
    return;
  }
 
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }
 
  if (req.url === '/users' && req.method === 'GET') {
    const users = [
      { id: 1, name: 'Ana' },
      { id: 2, name: 'Bruno' }
    ];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
    return;
  }

  if (req.url === '/about' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ name: 'My First Server', version: '1.0.0' }));
    return;
  }

  if (req.url === '/time' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ now: new Date().toISOString() }));
    return;
  }

  if (url.pathname === '/echo' && req.method === 'GET') {
    const message = url.searchParams.get('message') || '';
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ echo: message }));
    return;
  } 
 
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});
 
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
