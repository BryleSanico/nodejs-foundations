// server.js

/*
EXERCISE: 5.3 — Read the Request Body
Copy server.js to server-post.js. Add a POST /users route that reads JSON from the request body and echoes it back in the response.

This is harder than it sounds with the raw http module — you have to listen to 'data' and 'end' events:

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    const parsed = JSON.parse(body);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ received: parsed }));
  });

Test it by sending a POST request from Bruno with a JSON body.

Notice how much work this takes. Express will handle it for you in one line.

*/
const http = require('http');
 
const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
 
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
 
  if (req.url === '/users' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const parsed = JSON.parse(body);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ received: parsed }));
    });
    return;
  }
 
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});
 
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
