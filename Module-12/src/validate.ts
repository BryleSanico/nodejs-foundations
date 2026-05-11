import { Request, Response, NextFunction } from "express";
import { HttpError } from "./middleware";

// Validation middleware for creating a task
export function validateCreateTask(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const { title } = req.body;
  if (!title || typeof title !== "string") {
    return next(new HttpError(400, "title is required and must be a string"));
  }
  if (title.length < 1 || title.length > 100) {
    return next(
      new HttpError(400, "title must be between 1 and 100 characters"),
    );
  }
  next();
}

// Generic factory
type FieldRule = {
  type?: "string" | "number" | "boolean";
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
};

type BodyRules = Record<string, FieldRule>;

export function validateBody(rules: BodyRules) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    for (const [field, rule] of Object.entries(rules)) {
      const value = req.body[field];

      if (
        rule.required &&
        (value === undefined || value === null || value === "")
      ) {
        return next(new HttpError(400, `${field} is required`));
      }

      if (value === undefined || value === null) continue;

      if (rule.type && typeof value !== rule.type) {
        return next(new HttpError(400, `${field} must be a ${rule.type}`));
      }

      if (typeof value === "string") {
        if (rule.minLength !== undefined && value.length < rule.minLength) {
          return next(
            new HttpError(
              400,
              `${field} must be at least ${rule.minLength} characters`,
            ),
          );
        }
        if (rule.maxLength !== undefined && value.length > rule.maxLength) {
          return next(
            new HttpError(
              400,
              `${field} must be at most ${rule.maxLength} characters`,
            ),
          );
        }
      }

      if (typeof value === "number") {
        if (rule.min !== undefined && value < rule.min) {
          return next(
            new HttpError(400, `${field} must be at least ${rule.min}`),
          );
        }
        if (rule.max !== undefined && value > rule.max) {
          return next(
            new HttpError(400, `${field} must be at most ${rule.max}`),
          );
        }
      }
    }
    next();
  };
}
