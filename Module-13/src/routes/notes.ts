// src/routes/notes.ts
import { Router, Request, Response } from "express";
import { prisma } from "../db";
import { createNoteSchema, updateNoteSchema, noteQuerySchema } from "../schemas";
import { validate } from "../validate";
import { asyncHandler } from "../async-handler";

const router = Router();

// List all notes (supports ?tag= and ?search=)
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const query = noteQuerySchema.parse(req.query);

    const notes = await prisma.note.findMany({
      where: {
        ...(query.tag && { tag: query.tag }),
        ...(query.search && {
          OR: [
            { title: { contains: query.search } },
            { content: { contains: query.search } },
          ],
        }),
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(notes);
  }),
);

// Get one note
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const note = await prisma.note.findUnique({
      where: { id: parseInt(req.params.id as string) as number },
    });
    if (!note) {
      res.status(404).json({ error: { status: 404, message: "Note not found" } });
      return;
    }
    res.json(note);
  }),
);

// Create a note (Zod validates the body before this runs)
router.post(
  "/",
  validate(createNoteSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const note = await prisma.note.create({ data: req.body });
    res.status(201).json(note);
  }),
);

// Update a note
router.put(
  "/:id",
  validate(updateNoteSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const note = await prisma.note.update({
      where: { id: parseInt(req.params.id as string) as number },
      data: req.body,
    });
    res.json(note);
  }),
);

// Delete a note
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.note.delete({
      where: { id: parseInt(req.params.id as string) as number },
    });
    res.status(204).send();
  }),
);

export default router;
