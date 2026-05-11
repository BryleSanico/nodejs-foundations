import { Router, Request, Response } from "express";
import { HttpError } from "./middleware";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "member";
  bio?: string;
}

interface CreateUserBody extends Omit<User, "id"> {}
interface UpdateUserBody extends Partial<Omit<User, "id">> {}

const router = Router();
let users: User[] = [];
let nextId = 1;

router.get("/", (_req: Request, res: Response) => {
  res.json(users);
});

router.get("/:id", (req: Request<{ id: string }>, res: Response) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  res.json(user);
});

router.post("/", (req: Request<{}, {}, CreateUserBody>, res: Response) => {
  const { name, email, role, bio } = req.body;
  if (!name || !email || !role) {
    throw new HttpError(422, "name, email, and role are required");
  }
  if (role !== "admin" && role !== "member") {
    throw new HttpError(422, "role must be 'admin' or 'member'");
  }
  const user: User = { id: nextId++, name, email, role, ...(bio && { bio }) };
  users.push(user);
  res.status(201).json(user);
});

router.put(
  "/:id",
  (req: Request<{ id: string }, {}, UpdateUserBody>, res: Response) => {
    const user = users.find((u) => u.id === parseInt(req.params.id));
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    const { name, email, role, bio } = req.body;
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;
    if (bio !== undefined) user.bio = bio;
    res.json(user);
  },
);

router.delete("/:id", (req: Request<{ id: string }>, res: Response) => {
  const idx = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (idx === -1) {
    throw new HttpError(404, "User not found");
  }
  users.splice(idx, 1);
  res.status(204).send();
});

export default router;
