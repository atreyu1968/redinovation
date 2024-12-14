import { db } from '../database.js';

export const getActions = async (req, res) => {
  try {
    let query = 'SELECT * FROM actions WHERE 1=1';
    const params = [];

    if (req.query.network) {
      query += ' AND network = ?';
      params.push(req.query.network);
    }

    if (req.query.center) {
      query += ' AND center = ?';
      params.push(req.query.center);
    }

    const actions = await db.all(query, params);
    res.json(actions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAction = async (req, res) => {
  try {
    const { name, location, description, startDate, endDate } = req.body;
    const result = await db.run(
      'INSERT INTO actions (id, name, location, description, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?)',
      [Date.now().toString(), name, location, description, startDate, endDate]
    );
    res.status(201).json({ id: result.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};