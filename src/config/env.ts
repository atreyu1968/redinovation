import { z } from 'zod';

// Environment schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_URL: z.string().url().default('http://localhost:3000'),
  APP_NAME: z.string().default('Red de Innovación FP'),
});

// Parse environment variables
export const env = envSchema.parse({
  NODE_ENV: import.meta.env.MODE,
  API_URL: import.meta.env.VITE_API_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME,
});