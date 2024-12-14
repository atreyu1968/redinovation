import { db } from '../database.js';

export const findUserByEmail = async (email) => {
  return db.get('SELECT * FROM users WHERE email = ?', [email]);
};

export const createUser = async (userData) => {
  const result = await db.run(
    'INSERT INTO users (id, name, email, role) VALUES (?, ?, ?, ?)',
    [Date.now().toString(), userData.name, userData.email, userData.role]
  );
  return { id: result.id, ...userData };
};