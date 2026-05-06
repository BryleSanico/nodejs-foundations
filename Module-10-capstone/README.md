# Module-10 Capstone — Notes API

![Node.js](https://img.shields.io/badge/Node.js-20.6+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-v5-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-v7-2D3748?logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Persistence-003B57?logo=sqlite&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-Validation-3E67B1?logo=zod&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-Testing-C21325?logo=jest&logoColor=white)
![Supertest](https://img.shields.io/badge/Supertest-Integration_Tests-009688?logo=testcafe&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-Formatted-F7B93E?logo=prettier&logoColor=black)

> **A Notes management REST API — Express + Prisma + SQLite, with schema-validated CRUD, filtering, search, sort, pagination, and tested end-to-end.**

---

## Features

- Full CRUD for notes (`/notes`)
- Filtering, search, sort, and pagination on list endpoint
- Zod-based request validation (Create vs Update schemas, strict object checks)
- Centralized error handling via `HttpError` class
- Request logging with morgan (silenced in tests)
- Dependency-injected Prisma client (real client in prod, mock in tests)
- Graceful shutdown on `SIGINT` / `SIGTERM`
- Prettier-formatted code

## Project structure

```
src/
├── server.js              ← bootstrap + graceful shutdown
├── app.js                 ← createApp factory (DI for prisma)
├── db.js                  ← singleton Prisma client + better-sqlite3 adapter
├── routes/
│   └── notes.js           ← /notes CRUD + filtering/search/sort/pagination
├── middleware/
│   ├── validate.js        ← generic validate(schema, source) factory
│   └── errorHandler.js    ← maps HttpError → response, falls back to 500
├── schemas/
│   └── note.js            ← Zod schemas (create / update / param-id)
└── utils/
    └── HttpError.js       ← class HttpError extends Error
tests/
└── notes.test.js          ← 23 Supertest integration tests
prisma/
├── schema.prisma          ← Note model
└── migrations/            ← migration history
docs/                      ← walkthrough markdown files
```

## Prerequisites

- Node.js **20.6+**
- npm

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env (if not already present)
echo 'DATABASE_URL="file:./dev.db"' > .env

# 3. Run the initial database migration
npm run db:migrate
```

## Running the server

```bash
# Development (auto-reload via nodemon)
npm run dev

# Production-style start
npm start
```

The server listens on `http://localhost:3000` (override with `PORT=4000 npm start`).

You should see:

```
Server is running on port 3000
```

…and morgan logs for each request in the terminal.

## Testing

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage
```

Current coverage: **97% statements / 100% functions / 84% branches**.

The test suite (`tests/notes.test.js`) uses **Supertest** to send real HTTP requests against the Express app, with Prisma mocked via `jest.fn()` for speed and isolation. No database is required to run tests.

## Code formatting

```bash
# Format all files
npm run format

# Verify formatting (CI-friendly, exits non-zero if anything's unformatted)
npm run format:check
```

Config is in `.prettierrc.json`.

## Database tools

```bash
# Apply pending migrations / create a new one
npm run db:migrate

# Open Prisma Studio (visual DB browser)
npm run db:studio
```

## API Endpoints

Base URL: `http://localhost:3000`

### Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Returns `{ "status": "OK" }` |

### Notes

| Method | Path | Description |
|---|---|---|
| `GET` | `/notes` | List notes (supports filtering, search, sort, pagination) |
| `GET` | `/notes/:id` | Fetch one note by id |
| `POST` | `/notes` | Create a note |
| `PUT` | `/notes/:id` | Partial update of a note |
| `DELETE` | `/notes/:id` | Delete a note |

### `GET /notes` query parameters

| Param | Type | Default | Description |
|---|---|---|---|
| `tag` | string | — | Filter by exact tag match |
| `q` | string | — | Case-insensitive search in `title` and `content` |
| `page` | int ≥ 1 | `1` | Page number |
| `limit` | int 1–100 | `10` | Items per page |
| `sort` | `field:dir` | `createdAt:desc` | `field` ∈ {title, createdAt, updatedAt}; `dir` ∈ {asc, desc} |

### Note shape

```json
{
  "id": 1,
  "title": "Sprint planning",
  "content": "Discuss capstone delivery",
  "tag": "work",
  "createdAt": "2026-05-06T08:00:00.000Z",
  "updatedAt": "2026-05-06T08:00:00.000Z"
}
```

### Validation rules

| Field | Rule |
|---|---|
| `title` | string, 1–100 chars (trimmed). Required on create. |
| `content` | string, 1–5000 chars (trimmed). Required on create. |
| `tag` | string, max 30 chars. Optional. |
| `id` | auto-generated. Cannot be set by client. |
| `createdAt` / `updatedAt` | auto-managed. Cannot be set by client. |

Schemas use `.strict()` — unknown fields in the request body are rejected with **400**.

### Response shape — `GET /notes`

```json
{
  "data": [ { ...note }, { ...note } ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 47,
    "totalPages": 5
  }
}
```

### Error response shape

All errors return JSON in this form:

```json
{
  "error": "Title cannot be empty",
  "details": [
    { "path": "title", "message": "Title cannot be empty" }
  ]
}
```

`details` is included only for validation errors.

| Status | When |
|---|---|
| `400` | Validation error (bad body, bad query param, bad path id) |
| `404` | Note not found |
| `500` | Unexpected server/DB error |

## Example requests

```bash
# Create
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Sprint planning","content":"Discuss capstone","tag":"work"}'

# List page 1
curl "http://localhost:3000/notes?page=1&limit=10"

# Filter + search + sort
curl "http://localhost:3000/notes?tag=work&q=sprint&sort=title:asc"

# Get one
curl http://localhost:3000/notes/1

# Partial update
curl -X PUT http://localhost:3000/notes/1 \
  -H "Content-Type: application/json" \
  -d '{"tag":"urgent"}'

# Delete
curl -X DELETE http://localhost:3000/notes/1
```

## Tech stack

- **express** 5 — HTTP framework
- **@prisma/client** 7 + **@prisma/adapter-better-sqlite3** — ORM with driver adapter
- **zod** 4 — runtime validation
- **morgan** — request logging
- **dotenv** — `.env` loading (used by `prisma.config.ts` and `server.js`)
- **jest** + **supertest** — testing
- **prettier** — formatting
- **nodemon** — dev auto-reload
