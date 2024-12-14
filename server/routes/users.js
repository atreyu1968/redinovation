import express from 'express';
import { db } from '../database.js';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await db.all('SELECT * FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create user
router.post('/', async (req, res) => {
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
});

export default router;