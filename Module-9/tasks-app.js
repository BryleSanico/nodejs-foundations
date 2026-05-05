// tasks-app.js

const express = require('express');

function createApp() {
    const app = express();
    app.use(express.json());
    
    let tasks = [];
    let nextId = 1;

    app.get('/tasks', (req, res) => {
        res.json(tasks);
    });

    app.get('/tasks/:id', (req, res) => {
        const task = tasks.find(t => t.id === parseInt(req.params.id));
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    });

    app.post('/tasks', (req, res) => {
        const { title } = req.body;
        if (!title) return res.status(400).json({ error: 'Title is required' });
        const newTask = { id: nextId++, title, done: false };
        tasks.push(newTask);
        res.status(201).json(newTask);
    });

    app.put('/tasks/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const task = tasks.find(t => t.id === id);
        
        if (!task) return res.status(404).json({ error: 'Task not found' });

        const { title, done } = req.body;
        if (title !== undefined) task.title = title;
        if (done !== undefined) task.done = done;
        res.json(task);
    });
    
    app.delete('/tasks/:id', (req, res) => {
        const idx = tasks.findIndex(t => t.id === parseInt(req.params.id));
        if (idx === -1) return res.status(404).json({ error: 'Task not found' });
        tasks.splice(idx, 1);
        res.status(204).end();
    });
    
    return app;
}


module.exports = createApp;
