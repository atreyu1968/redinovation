import { db } from '../database.js';

export const findActions = async (filters = {}) => {
  let query = 'SELECT * FROM actions WHERE 1=1';
  const params = [];

  if (filters.network) {
    query += ' AND network = ?';
    params.push(filters.network);
  }

  if (filters.center) {
    query += ' AND center = ?';
    params.push(filters.center);
  }

  return db.all(query, params);
};

export const createAction = async (actionData) => {
  const result = await db.run(
    'INSERT INTO actions (id, name, location, description) VALUES (?, ?, ?, ?)',
    [Date.now().toString(), actionData.name, actionData.location, actionData.description]
  );
  return { id: result.id, ...actionData };
};