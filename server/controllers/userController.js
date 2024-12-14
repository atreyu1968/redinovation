import { db } from '../database.js';

export const getUsers = async (req, res) => {
  try {
    const users = await db.all('SELECT * FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const result = await db.run(
      'INSERT INTO users (id, name, email, role) VALUES (?, ?, ?, ?)',
      [Date.now().toString(), name, email, role]
    );
    res.status(201).json({ id: result.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};