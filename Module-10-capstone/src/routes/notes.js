const express = require('express');
const { validateNoteData, validateParamId } = require('../middleware/validate');
const HttpError = require('../utils/HttpError');

function createNotesRouter(prisma) {
    const router = express.Router();

    // List all notes
    router.get('/', async (req, res, next) => {
        try {
            const notes = await prisma.note.findMany({
                orderBy: { createdAt: 'desc' },
            });
            res.json(notes);
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
