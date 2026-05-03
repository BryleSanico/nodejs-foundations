// async-errors.js

const express = require('express');
const app = express();
const PORT = 3000;

  app.get('/slow', async (req, res, next) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        throw new Error('Something went wrong');
    } catch (err) {
      next(err);
    }
  });

// Global error handler (4 arguments!)
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    if (err.details) {
        return res.status(status).json({ error: { status, message, details: err.details } });
    }
    res.status(status).json({ error: status, message });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});