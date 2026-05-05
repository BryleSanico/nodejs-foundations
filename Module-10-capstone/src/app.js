const express = require('express');
const notesRouter = require('./routes/notes');
const errorHandler = require('./middleware/errorHandler');

function createApp({ prisma = require('./db') } = {}) {
    const app = express();

    app.use(express.json());
    app.use('/notes', notesRouter(prisma));

    app.get('/health', (req, res) => res.json({ status: 'OK' }));

    app.use(errorHandler);
    return app;
}

module.exports = createApp;
