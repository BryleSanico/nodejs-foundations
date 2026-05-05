// comment-api.js

const express = require('express');

function createCommentsRouter() {
  const router = express.Router();
  let comments = [];
  let nextId = 1;

  router.post('/', (req, res) => {
    const { text, author } = req.body;
    if (!text || !author) return res.status(400).json({ error: 'Text and author are required' });
    const newComment = { id: nextId++, text, author };
    comments.push(newComment);
    res.status(201).json(newComment);
  });

  router.get('/', (req, res) => {
    res.json(comments);
  });

  router.get('/:id', (req, res) => {
    const comment = comments.find(c => c.id === parseInt(req.params.id));
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.json(comment);
  });
  
  return router;
}

module.exports = createCommentsRouter;