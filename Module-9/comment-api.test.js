// comment-api.test.js

const request = require('supertest');
const express = require('express');
const createCommentsRouter = require('./comment-api');

describe('Comments API', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/comments', createCommentsRouter());
  });

  describe('POST /comments', () => {
    test('creates a comment with text and author', async () => {
      const res = await request(app)
        .post('/comments')
        .send({ text: 'Hello world', author: 'Alice' });
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ id: 1, text: 'Hello world', author: 'Alice' });
    });

    test('returns 400 if text is missing', async () => {
      const res = await request(app)
        .post('/comments')
        .send({ author: 'Alice' });
      expect(res.status).toBe(400);
    });

    test('returns 400 if author is missing', async () => {
      const res = await request(app)
        .post('/comments')
        .send({ text: 'Hello world' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /comments', () => {
    test('returns all comments', async () => {
      await request(app).post('/comments').send({ text: 'First comment', author: 'Bob' });
      await request(app).post('/comments').send({ text: 'Second comment', author: 'Carol' });
      const res = await request(app).get('/comments');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe('GET /comments/:id', () => {
    test('returns one comment by id', async () => {
      await request(app).post('/comments').send({ text: 'A comment', author: 'Dave' });
      const res = await request(app).get('/comments/1');
      expect(res.status).toBe(200);
      expect(res.body.text).toBe('A comment');
    });

    test('returns 404 for missing ids', async () => {
      const res = await request(app).get('/comments/999');
      expect(res.status).toBe(404);
    });
  });
});
