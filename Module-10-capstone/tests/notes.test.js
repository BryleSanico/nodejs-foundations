process.env.NODE_ENV = 'test';

const request = require('supertest');
const createApp = require('../src/app');

function buildPrismaMock() {
    return {
        note: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
    };
}

describe('Notes API', () => {
    let app;
    let prisma;

    beforeEach(() => {
        prisma = buildPrismaMock();
        app = createApp({ prisma });
    });

    describe('GET /health', () => {
        test('returns 200 OK', async () => {
            const res = await request(app).get('/health');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ status: 'OK' });
        });
    });

    describe('GET /notes', () => {
        test('returns paginated data and total', async () => {
            const sample = [
                { id: 2, title: 'Two', content: 'b', tag: null, createdAt: new Date(), updatedAt: new Date() },
                { id: 1, title: 'One', content: 'a', tag: null, createdAt: new Date(), updatedAt: new Date() },
            ];
            prisma.note.findMany.mockResolvedValue(sample);
            prisma.note.count.mockResolvedValue(2);

            const res = await request(app).get('/notes');

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(2);
            expect(res.body.pagination).toEqual({
                page: 1,
                limit: 10,
                total: 2,
                totalPages: 1,
            });
            expect(prisma.note.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: {},
                    orderBy: { createdAt: 'desc' },
                    skip: 0,
                    take: 10,
                }),
            );
        });

        test('returns 400 when page is invalid', async () => {
            const res = await request(app).get('/notes?page=0');
            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/page/i);
        });

        test('returns 400 when limit exceeds max', async () => {
            const res = await request(app).get('/notes?limit=999');
            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/limit/i);
        });

        test('applies tag filter to where clause', async () => {
            prisma.note.findMany.mockResolvedValue([]);
            prisma.note.count.mockResolvedValue(0);

            await request(app).get('/notes?tag=work');

            expect(prisma.note.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { tag: 'work' } }),
            );
            expect(prisma.note.count).toHaveBeenCalledWith({ where: { tag: 'work' } });
        });

        test('applies search to title and content via OR', async () => {
            prisma.note.findMany.mockResolvedValue([]);
            prisma.note.count.mockResolvedValue(0);

            await request(app).get('/notes?q=hello');

            expect(prisma.note.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: {
                        OR: [
                            { title: { contains: 'hello' } },
                            { content: { contains: 'hello' } },
                        ],
                    },
                }),
            );
        });

        test('applies sort=title:asc to orderBy', async () => {
            prisma.note.findMany.mockResolvedValue([]);
            prisma.note.count.mockResolvedValue(0);

            await request(app).get('/notes?sort=title:asc');

            expect(prisma.note.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ orderBy: { title: 'asc' } }),
            );
        });

        test('returns 400 for invalid sort field', async () => {
            const res = await request(app).get('/notes?sort=password:asc');
            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/sort field/i);
        });

        test('returns 400 for invalid sort direction', async () => {
            const res = await request(app).get('/notes?sort=title:sideways');
            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/sort direction/i);
        });

        test('returns 500 on unexpected DB error', async () => {
            prisma.note.findMany.mockRejectedValue(new Error('boom'));
            prisma.note.count.mockRejectedValue(new Error('boom'));

            const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const res = await request(app).get('/notes');
            errorSpy.mockRestore();

            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Internal Server Error');
        });
    });

    describe('GET /notes/:id', () => {
        test('returns the note when it exists', async () => {
            const note = { id: 1, title: 'A', content: 'B', tag: null };
            prisma.note.findUnique.mockResolvedValue(note);

            const res = await request(app).get('/notes/1');

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({ id: 1, title: 'A' });
            expect(prisma.note.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        test('returns 404 when not found', async () => {
            prisma.note.findUnique.mockResolvedValue(null);

            const res = await request(app).get('/notes/999');

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Note not found');
        });

        test('returns 400 when id is not an integer', async () => {
            const res = await request(app).get('/notes/abc');
            expect(res.status).toBe(400);
            expect(prisma.note.findUnique).not.toHaveBeenCalled();
        });
    });

    describe('POST /notes', () => {
        test('creates a note with valid body', async () => {
            const created = { id: 1, title: 'Hi', content: 'There', tag: null };
            prisma.note.create.mockResolvedValue(created);

            const res = await request(app)
                .post('/notes')
                .send({ title: 'Hi', content: 'There' });

            expect(res.status).toBe(201);
            expect(res.body).toMatchObject({ id: 1, title: 'Hi', content: 'There' });
            expect(prisma.note.create).toHaveBeenCalledWith({
                data: { title: 'Hi', content: 'There' },
            });
        });

        test('returns 400 when title is missing', async () => {
            const res = await request(app).post('/notes').send({ content: 'no title' });
            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/title/i);
            expect(prisma.note.create).not.toHaveBeenCalled();
        });

        test('returns 400 when title exceeds 100 chars', async () => {
            const res = await request(app)
                .post('/notes')
                .send({ title: 'x'.repeat(101), content: 'ok' });
            expect(res.status).toBe(400);
            expect(prisma.note.create).not.toHaveBeenCalled();
        });

        test('returns 400 when body has unknown fields (strict schema)', async () => {
            const res = await request(app)
                .post('/notes')
                .send({ title: 'a', content: 'b', isAdmin: true });
            expect(res.status).toBe(400);
            expect(prisma.note.create).not.toHaveBeenCalled();
        });

        test('returns 500 on unexpected DB error', async () => {
            prisma.note.create.mockRejectedValue(new Error('db down'));

            const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const res = await request(app)
                .post('/notes')
                .send({ title: 'ok', content: 'ok' });
            errorSpy.mockRestore();

            expect(res.status).toBe(500);
            expect(res.body.error).toBe('Internal Server Error');
        });
    });

    describe('PUT /notes/:id', () => {
        test('updates a note with a partial body', async () => {
            const updated = { id: 1, title: 'New', content: 'old', tag: null };
            prisma.note.update.mockResolvedValue(updated);

            const res = await request(app).put('/notes/1').send({ title: 'New' });

            expect(res.status).toBe(200);
            expect(res.body.title).toBe('New');
            expect(prisma.note.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { title: 'New' },
            });
        });

        test('returns 400 on empty body', async () => {
            const res = await request(app).put('/notes/1').send({});
            expect(res.status).toBe(400);
            expect(prisma.note.update).not.toHaveBeenCalled();
        });

        test('returns 404 when Prisma throws P2025', async () => {
            const err = new Error('Record to update not found.');
            err.code = 'P2025';
            prisma.note.update.mockRejectedValue(err);

            const res = await request(app).put('/notes/999').send({ title: 'x' });

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Note not found');
        });
    });

    describe('DELETE /notes/:id', () => {
        test('returns 204 on successful delete', async () => {
            prisma.note.delete.mockResolvedValue({ id: 1 });

            const res = await request(app).delete('/notes/1');

            expect(res.status).toBe(204);
            expect(res.body).toEqual({});
            expect(prisma.note.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        test('returns 404 when Prisma throws P2025', async () => {
            const err = new Error('Record to delete does not exist.');
            err.code = 'P2025';
            prisma.note.delete.mockRejectedValue(err);

            const res = await request(app).delete('/notes/999');

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Note not found');
        });
    });
});
