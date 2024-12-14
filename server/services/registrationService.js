import db from '../config/database.js';

export const validateRegistrationCode = async (code) => {
  // In production, verify against registration_codes table
  // For demo, accept any code
  return true;
};