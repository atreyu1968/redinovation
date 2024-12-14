import { z } from 'zod';

// Common validation schemas
export const idSchema = z.string().min(1);

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export const dateSchema = z.string().datetime();

export const emailSchema = z.string().email();

export const passwordSchema = z.string().min(8);

// Validation middleware
export const validate = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse(req.body);
    req.validatedData = validated;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors
      });
    } else {
      next(error);
    }
  }
};