import { z } from 'zod';

// Common validation schemas
export const idSchema = z.string().min(1);
export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(8);
export const dateSchema = z.string().datetime();

// User validation schemas
export const userSchema = z.object({
  name: z.string().min(2),
  lastName: z.string().min(2),
  email: emailSchema,
  password: passwordSchema.optional(),
  medusaCode: z.string().min(4),
  phone: z.string().optional(),
  center: z.string().optional(),
  network: z.string().optional(),
  role: z.enum(['admin', 'general_coordinator', 'subnet_coordinator', 'manager', 'guest'])
});

// Action validation schemas
export const actionSchema = z.object({
  name: z.string().min(3),
  location: z.string().min(3),
  description: z.string().min(10),
  startDate: dateSchema,
  endDate: dateSchema,
  studentParticipants: z.number().int().min(0),
  teacherParticipants: z.number().int().min(0),
  rating: z.number().int().min(1).max(5),
  comments: z.string().optional(),
  network: z.string(),
  center: z.string(),
  quarter: z.string()
});