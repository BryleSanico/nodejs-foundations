// nested.js

/*

EXERCISE: 6.4 — Nested Routes
Create a file called nested.js. This time you have projects and each project has tasks:

  let projects = [
    { id: 1, name: 'Website Redesign', tasks: [
      { id: 1, title: 'Mockups', done: true },
      { id: 2, title: 'Build homepage', done: false }
    ]},
    { id: 2, name: 'API Migration', tasks: [] }
  ];

Implement:
• GET /projects — list all projects
• GET /projects/:id/tasks — list tasks for a specific project (404 if project doesn't exist)
• POST /projects/:id/tasks — add a new task to a project

Nested routes like this are extremely common in real APIs. Practice reading multiple URL params.

*/

const express = require('express');
const app = express();

app.use(express.json());

// In-memory data store
let projects = [
  { id: 1, name: 'Website Redesign', tasks: [
    { id: 1, title: 'Mockups', done: true },
    { id: 2, title: 'Build homepage', done: false }
  ]},
  { id: 2, name: 'API Migration', tasks: [] }
];

// List all projects
app.get('/projects', (req, res) => {
  res.json(projects);
});

// List tasks for a specific project
app.get('/projects/:id/tasks', (req, res) => {
  const id = parseInt(req.params.id);
  const project = projects.find(p => p.id === id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project.tasks);
});

// Add a new task to a project

app.post('/projects/:id/tasks', (req, res) => {
    const id = parseInt(req.params.id);
    const project = projects.find(p => p.id === id);
    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }

    const nextId = project.tasks.length ? Math.max(...project.tasks.map(t => t.id)) + 1 : 1;
    const newTask = {
        id: nextId,
        title: req.body.title,
        done: false
    };

    project.tasks.push(newTask);
    res.status(201).json(newTask);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
