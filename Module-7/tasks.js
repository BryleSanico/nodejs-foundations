// tasks.js

const express = require('express');
const morgan = require('morgan');
const app = express();

// Custom middleware: measure how long each request takes
function requestTimer(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const elapsed = Date.now() - start;
    console.log(`${req.method} ${req.path} took ${elapsed}ms`);
  });
  next();
}

app.use(requestTimer);
app.use(express.json());
app.use(morgan('dev'));

// In-memory data store for tasks
let tasks = [
  { id: 1, title: 'Buy groceries', done: false }
];
let nextId = 2;

// Custom error class for HTTP errors
class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    if (details) this.details = details;
  }
}


// Fake auth middleware: requires X-API-Key: secret123
function fakeAuth(req, res, next) {
  const apiKey = req.get('X-API-Key');
  if (apiKey !== 'secret123') {
    return next(new HttpError(401, 'Unauthorized: invalid or missing X-API-Key'));
  }
  next();
}

// Validation middleware for POST and PUT — collects all errors before failing
function validateTask(req, res, next) {
  const { title, done } = req.body || {};
  const details = [];

  if (title === undefined || title === null) {
    details.push('title is required');
  } else if (typeof title !== 'string') {
    details.push('title must be a string');
  } else {
    if (title.trim() === '') details.push('title cannot be empty');
    if (title.length > 100) details.push('title must be 100 characters or fewer');
  }

  if (details.length > 0) {
    return next(new HttpError(400, 'Validation failed', details));
  }

  next();
}

// Routes
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/tasks/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return next(new HttpError(404, 'Task not found'));
  }
  res.json(task);
});

app.post('/tasks', fakeAuth, validateTask, (req, res) => {
  const newTask = {
    id: nextId++,
    title: req.body.title,
    done: false
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', fakeAuth, validateTask, (req, res, next) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return next(new HttpError(404, 'Task not found'));
  }
  task.title = req.body.title;
  if (typeof req.body.done === 'boolean') {
    task.done = req.body.done;
  }
  res.json(task);
});

app.delete('/tasks/:id', fakeAuth, (req, res, next) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    return next(new HttpError(404, 'Task not found'));
  }
  tasks.splice(index, 1);
  res.status(204).end();
});

// 404 handler for unknown routes
app.use((req, res, next) => {
  next(new HttpError(404, `Route ${req.method} ${req.path} not found`));
});

// Global error handler (4 arguments!)
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    if (err.details) {
        return res.status(status).json({ error: { status, message, details: err.details } });
    }
    res.status(status).json({ error: status, message });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});