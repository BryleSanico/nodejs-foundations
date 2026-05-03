// app.js

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
 
const app = express();
 
// Third-party middleware
app.use(cors());           // allow cross-origin requests
app.use(express.json());   // parse JSON bodies
app.use(morgan('dev'));    // log every request
 
// Custom middleware: add a timestamp to every request
app.use((req, res, next) => {
  req.timestamp = new Date().toISOString();
  next();
});
 
// Custom middleware: log the request path
app.use((req, res, next) => {
  console.log(`[${req.timestamp}] ${req.method} ${req.path}`);
  next();
});
 
app.get('/', (req, res) => {
  res.json({ message: 'Hello with middleware!', at: req.timestamp });
});
 
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

