const express = require('express');
const morgan = require('morgan');
const notesRouter = require('./routes/notes');
const errorHandler = require('./middleware/errorHandler');

function createApp({ prisma = require('./db') } = {}) {
    const app = express();

    if (process.env.NODE_ENV !== 'test') {
        app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
    }
    app.use(express.json());
    app.use('/notes', notesRouter(prisma));

    app.get('/health', (req, res) => res.json({ status: 'OK' }));

    app.use(errorHandler);
    return app;
}

module.exports = createApp;
