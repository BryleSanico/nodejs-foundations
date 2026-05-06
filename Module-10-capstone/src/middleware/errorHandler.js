const HttpError = require('../utils/HttpError');

function errorHandler(err, req, res, next) {
    if (res.headersSent) return next(err);

    if (err instanceof HttpError) {
        const body = { error: err.message };
        if (err.details) body.details = err.details;
        return res.status(err.status).json(body);
    }

    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = errorHandler;
