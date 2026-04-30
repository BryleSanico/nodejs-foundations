// app.js

const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
 
// Define routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});
 
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
 
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});





