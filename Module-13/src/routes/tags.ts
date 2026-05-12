// src/routes/tags.ts
import { Router, Request, Response, NextFunction } from "express";
import { Prisma } from "../../generated/prisma";
import { prisma } from "../db";
import { createTagSchema } from "../schemas";
import { validate } from "../validate";

const router = Router();

// List all tags
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
    res.json(tags);
  } catch (err) {
    next(err);
  }
});

// Create a tag
router.post(
  "/",
  validate(createTagSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tag = await prisma.tag.create({ data: req.body });
      res.status(201).json(tag);
    } catch (err: unknown) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        return res
          .status(409)
          .json({ error: { status: 409, message: "Tag name already exists" } });
      }
      next(err);
    }
  },
);

export default router;
