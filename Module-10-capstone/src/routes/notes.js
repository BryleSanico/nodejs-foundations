const express = require('express');
const { validateNoteData, validateParamId } = require('../middleware/validate');
const HttpError = require('../utils/HttpError');

function createNotesRouter(prisma) {
    const router = express.Router();

    // List notes (filtering, search, sort, pagination)
    router.get('/', async (req, res, next) => {
        try {
            const { tag, q, page = '1', limit = '10', sort } = req.query;

            // Parse and validate pagination parameters
            const pageNum = parseInt(page, 10);
            const limitNum = parseInt(limit, 10);
            if (Number.isNaN(pageNum) || pageNum < 1) {
                throw new HttpError(400, 'page must be a positive integer');
            }
            if (Number.isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
                throw new HttpError(400, 'limit must be between 1 and 100');
            }

            // Build Prisma query conditions
            const where = {};
            if (tag) where.tag = tag;
            if (q) {
                where.OR = [
                    { title: { contains: q } },
                    { content: { contains: q } },
                ];
            }

            // Handle sorting
            let orderBy = { createdAt: 'desc' };
            if (sort) {
                const [field, dir = 'asc'] = sort.split(':');
                const allowedFields = ['title', 'createdAt', 'updatedAt'];
                const allowedDirs = ['asc', 'desc'];
                if (!allowedFields.includes(field)) {
                    throw new HttpError(400, `sort field must be one of: ${allowedFields.join(', ')}`);
                }
                if (!allowedDirs.includes(dir)) {
                    throw new HttpError(400, 'sort direction must be asc or desc');
                }
                orderBy = { [field]: dir };
            }

            // Execute query and count in parallel
            const [data, total] = await Promise.all([
                prisma.note.findMany({
                    where,
                    orderBy,
                    skip: (pageNum - 1) * limitNum,
                    take: limitNum,
                }),
                prisma.note.count({ where }),
            ]);

            res.json({
                data,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    totalPages: Math.ceil(total / limitNum),
                },
            });
        } catch (err) {
            next(err);
        }
    });

    // Get one note
    router.get('/:id', validateParamId, async (req, res, next) => {
        try {
            const note = await prisma.note.findUnique({
                where: { id: req.id },
            });
            if (!note) throw new HttpError(404, 'Note not found');
            res.json(note);
        } catch (err) {
            next(err);
        }
    });

    // Create a new note
    router.post('/', validateNoteData, async (req, res, next) => {
        try {
            const { title, content, tag } = req.body;
            const newNote = await prisma.note.create({
                data: { title, content, tag },
            });
            res.status(201).json(newNote);
        } catch (err) {
            next(err);
        }
    });

    // Update a note
    router.put('/:id', validateParamId, validateNoteData, async (req, res, next) => {
        try {
            const { title, content, tag } = req.body;
            const note = await prisma.note.update({
                where: { id: req.id },
                data: { title, content, tag },
            });
            res.json(note);
        } catch (err) {
            if (err.code === 'P2025') return next(new HttpError(404, 'Note not found'));
            next(err);
        }
    });

    // Delete a note
    router.delete('/:id', validateParamId, async (req, res, next) => {
        try {
            await prisma.note.delete({
                where: { id: req.id },
            });
            res.status(204).end();
        } catch (err) {
            if (err.code === 'P2025') return next(new HttpError(404, 'Note not found'));
            next(err);
        }
    });

    return router;
}

module.exports = createNotesRouter;
