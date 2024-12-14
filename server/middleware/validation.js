import { ValidationError } from '../utils/errors.js';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.validatedData = validated;
      next();
    } catch (error) {
      next(new ValidationError(error.errors));
    }
  };
};