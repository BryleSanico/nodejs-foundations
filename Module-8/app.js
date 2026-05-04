// app.js

require('dotenv/config');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const createNotesRouter = require('./notes');

const app = express();
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

app.use(express.json());
app.use('/notes', createNotesRouter(prisma));

// List all tasks
app.get('/tasks', async (req, res, next) => {
    try {
        const where = {};
        if (req.query.done !== undefined) where.done = req.query.done === 'true';
        if (req.query.tag) where.tag = req.query.tag;
        const tasks = await prisma.task.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
        res.json(tasks);
    } catch (err) {
        next(err)
    }
});

// Get one task 
app.get('/tasks/:id', async (req, res, next) => {
    try {
        const task = await prisma.task.findUnique({
            where: { id: parseInt(req.params.id) },
        });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (err) {
        next(err);
    }
});

// Create a new task
app.post('/tasks', async (req, res, next) => {
    try {
        const { title, tag } = req.body;
        if (!title) return res.status(400).json({ error: 'Title is required' });
        const newTask = await prisma.task.create({
            data: { title, tag }
        });
        res.status(201).json(newTask);
    } catch (err) {
        next(err);
    }
});

// Update a task
app.put('/tasks/:id', async (req, res, next) => {
    try {
        const task = await prisma.task.update({
            where: { id: parseInt(req.params.id) },
            data: req.body,
        });
        res.json(task);
    } catch (err) {
        if(err.code === 'P2025') {
            return res.status(404).json({ error: 'Task not found' });
        }
        next(err);
    }
});


// Delete a task
app.delete('/tasks/:id', async (req, res, next) => {
    try {
        await prisma.task.delete({
            where: { id: parseInt(req.params.id) },
        });
        res.status(204).end();
    } catch (err) {
        if(err.code === 'P2025') {
            return res.status(404).json({ error: 'Task not found' });
        }
        next(err);
    }
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


        