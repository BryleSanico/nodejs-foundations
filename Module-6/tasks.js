// tasks.js
const express = require('express');
const app = express();
 
app.use(express.json());
 
/*
EXERCISE: 6.2 — Query Parameters
Extend your tasks.js to support filtering. Modify the GET /tasks route to accept an optional ?done=true or ?done=false query parameter:

• GET /tasks → returns all tasks
• GET /tasks?done=true → returns only completed tasks
• GET /tasks?done=false → returns only pending tasks
This will allow clients to easily filter tasks based on their completion status.
*/

// In-memory data store
let tasks = [
  { id: 1, title: 'Learn Express', done: false },
  { id: 2, title: 'Build an API', done: false }
];
let nextId = 3;
 
// List all tasks
app.get('/tasks', (req, res) => {
  
    // destructure the 'done' query parameter
    const { done } = req.query;
  
    // if 'done' is not provided, return all tasks
    if (done === undefined) {
      return res.json(tasks);
    }
  
    // filter tasks based on the 'done' query parameter
    const filteredTasks = tasks.filter(t => t.done === (done === 'true'));
    res.json(filteredTasks);
});
 
// Get one task by id
app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});
 
// Create a new task
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const task = { id: nextId++, title, done: false };
  tasks.push(task);
  res.status(201).json(task);
});
 
// Update a task
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  const { title, done } = req.body;
  if (title !== undefined) task.title = title;
  if (done !== undefined) task.done = done;
  res.json(task);
});
 
// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  tasks.splice(index, 1);
  res.status(204).send();
});
 
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Tasks API running at http://localhost:${PORT}`);
});

