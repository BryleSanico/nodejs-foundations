// notes.js

const express = require('express');

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
    router.get('/:id', async (req, res, next) => {
        try {
            const note = await prisma.note.findUnique({
                where: { id: parseInt(req.params.id) },
            });
            if (!note) return res.status(404).json({ error: 'Note not found' });
            res.json(note);
        } catch (err) {
            next(err);
        }
    });

    // Create a new note
    router.post('/', async (req, res, next) => {
        try {
            const { title, content } = req.body;
            if (!title) return res.status(400).json({ error: 'Title is required' });
            if (!content) return res.status(400).json({ error: 'Content is required' });
            const newNote = await prisma.note.create({
                data: { title, content },
            });
            res.status(201).json(newNote);
        } catch (err) {
            next(err);
        }
    });

    // Update a note
    router.put('/:id', async (req, res, next) => {
        try {
            const note = await prisma.note.update({
                where: { id: parseInt(req.params.id) },
                data: req.body,
            });
            res.json(note);
        } catch (err) {
            if (err.code === 'P2025') {
                return res.status(404).json({ error: 'Note not found' });
            }
            next(err);
        }
    });

    // Delete a note
    router.delete('/:id', async (req, res, next) => {
        try {
            await prisma.note.delete({
                where: { id: parseInt(req.params.id) },
            });
            res.status(204).end();
        } catch (err) {
            if (err.code === 'P2025') {
                return res.status(404).json({ error: 'Note not found' });
            }
            next(err);
        }
    });

    return router;
}

module.exports = createNotesRouter;
