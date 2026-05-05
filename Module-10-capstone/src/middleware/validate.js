const HttpError = require('../utils/HttpError');

function validateNoteData(req, res, next) {
    const { title, content, tag } = req.body;
    if (!title) return next(new HttpError(400, 'Title is required'));
    if (!content) return next(new HttpError(400, 'Content is required'));
    if (typeof title !== 'string') return next(new HttpError(400, 'Title must be a string'));
    if (typeof content !== 'string') return next(new HttpError(400, 'Content must be a string'));
    if (title.trim() === '') return next(new HttpError(400, 'Title cannot be empty'));
    if (content.trim() === '') return next(new HttpError(400, 'Content cannot be empty'));
    if (title.length > 100)
        return next(new HttpError(400, 'Title must be 100 characters or fewer'));
    if (content.length > 5000)
        return next(new HttpError(400, 'Content must be 5000 characters or fewer'));
    if (tag !== undefined) {
        if (typeof tag !== 'string') return next(new HttpError(400, 'Tag must be a string'));
        if (tag.length > 30) return next(new HttpError(400, 'Tag must be 30 characters or fewer'));
    }
    next();
}

function validateParamId(req, res, next) {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id) || id <= 0) {
        return next(new HttpError(400, 'ID must be a positive integer'));
    }
    req.id = id;
    next();
}

module.exports = { validateNoteData, validateParamId };
