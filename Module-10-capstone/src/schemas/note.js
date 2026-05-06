const { z } = require('zod');

const noteCreateSchema = z
    .object({
        title: z
            .string({ message: 'Title is required' })
            .trim()
            .min(1, 'Title cannot be empty')
            .max(100, 'Title must be 100 characters or fewer'),
        content: z
            .string({ message: 'Content is required' })
            .trim()
            .min(1, 'Content cannot be empty')
            .max(5000, 'Content must be 5000 characters or fewer'),
        tag: z.string().max(30, 'Tag must be 30 characters or fewer').optional(),
    })
    .strict();

const noteUpdateSchema = noteCreateSchema.partial();

const paramIdSchema = z.object({
    id: z.coerce.number().int('ID must be an integer').positive('ID must be a positive integer'),
});

module.exports = { noteCreateSchema, noteUpdateSchema, paramIdSchema };
