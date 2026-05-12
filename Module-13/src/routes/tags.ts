// src/routes/tags.ts
import { Router, Request, Response, NextFunction } from "express";
import { Prisma } from "../../generated/prisma";
import { prisma } from "../db";
import { createTagSchema, CreateTagInput } from "../schemas";
import { validate } from "../validate";
import { asyncHandler } from "../async-handler";

const router = Router();

// List all tags
router.get("/", asyncHandler(async (_req: Request, res: Response) => {
  const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
  res.json(tags);
}));

// Create a tag
router.post(
  "/",
  validate(createTagSchema),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body as CreateTagInput;
      const tag = await prisma.tag.create({ data: { name } });
      res.status(201).json(tag);
    } catch (err: unknown) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        res.status(409).json({ error: { status: 409, message: "Tag name already exists" } });
        return;
      }
      next(err);
    }
  }),
);

export default router;
