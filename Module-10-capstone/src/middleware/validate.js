const HttpError = require('../utils/HttpError');

function formatIssues(error) {
    return error.issues.map((issue) => ({
        path: issue.path.join('.') || '(root)',
        message: issue.message,
    }));
}

function validate(schema, source = 'body') {
    return (req, res, next) => {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
            const issues = formatIssues(result.error);
            return next(new HttpError(400, issues[0].message, issues));
        }
        if (source === 'params' && result.data.id !== undefined) {
            req.id = result.data.id;
        } else if (source === 'body') {
            req.body = result.data;
        }
        next();
    };
}

module.exports = { validate };
