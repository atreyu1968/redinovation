import db from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export const findNetworks = async (filters = {}) => {
  let query = 'SELECT * FROM networks WHERE 1=1';
  const params = [];

  if (filters.code) {
    query += ' AND code = ?';
    params.push(filters.code);
  }

  return db.all(query, params);
};

export const createNetwork = async (networkData) => {
  const result = await db.run(
    `INSERT INTO networks (id, code, name, description)
     VALUES (?, ?, ?, ?)`,
    [
      Date.now().toString(),
      networkData.code,
      networkData.name,
      networkData.description
    ]
  );

  return { id: result.id, ...networkData };
};

export const updateNetwork = async (id, networkData) => {
  const result = await db.run(
    `UPDATE networks 
     SET code = ?, name = ?, description = ?
     WHERE id = ?`,
    [networkData.code, networkData.name, networkData.description, id]
  );

  if (result.changes === 0) {
    throw new NotFoundError('Network not found');
  }

  return { id, ...networkData };
};

export const deleteNetwork = async (id) => {
  const result = await db.run('DELETE FROM networks WHERE id = ?', [id]);
  
  if (result.changes === 0) {
    throw new NotFoundError('Network not found');
  }

  return true;
};