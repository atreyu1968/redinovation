import express from 'express';
import { db } from '../database.js';

const router = express.Router();

// Get all academic years
router.get('/', async (req, res) => {
  try {
    const years = await db.all('SELECT * FROM academic_years');
    const quarters = await db.all('SELECT * FROM quarters');
    
    // Map quarters to their academic years
    const yearsWithQuarters = years.map(year => ({
      ...year,
      quarters: quarters.filter(q => q.academicYearId === year.id)
    }));
    
    res.json(yearsWithQuarters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create academic year
router.post('/', async (req, res) => {
  try {
    const { name, startDate, endDate, isActive, quarters } = req.body;
    
    // Start transaction
    await db.run('BEGIN TRANSACTION');

    // Create academic year
    const yearResult = await db.run(
      'INSERT INTO academic_years (id, name, startDate, endDate, isActive) VALUES (?, ?, ?, ?, ?)',
      [Date.now().toString(), name, startDate, endDate, isActive ? 1 : 0]
    );

    // Create quarters
    for (const quarter of quarters) {
      await db.run(
        'INSERT INTO quarters (id, academicYearId, name, startDate, endDate, isActive) VALUES (?, ?, ?, ?, ?, ?)',
        [
          Date.now().toString() + Math.random().toString(36).substr(2, 9),
          yearResult.id,
          quarter.name,
          quarter.startDate,
          quarter.endDate,
          quarter.isActive ? 1 : 0
        ]
      );
    }

    await db.run('COMMIT');
    res.status(201).json({ id: yearResult.id });
  } catch (error) {
    await db.run('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
});

// Update academic year
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, startDate, endDate, isActive, quarters } = req.body;

    await db.run('BEGIN TRANSACTION');

    // Update academic year
    await db.run(
      'UPDATE academic_years SET name = ?, startDate = ?, endDate = ?, isActive = ? WHERE id = ?',
      [name, startDate, endDate, isActive ? 1 : 0, id]
    );

    // Delete existing quarters
    await db.run('DELETE FROM quarters WHERE academicYearId = ?', [id]);

    // Create new quarters
    for (const quarter of quarters) {
      await db.run(
        'INSERT INTO quarters (id, academicYearId, name, startDate, endDate, isActive) VALUES (?, ?, ?, ?, ?, ?)',
        [
          quarter.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
          id,
          quarter.name,
          quarter.startDate,
          quarter.endDate,
          quarter.isActive ? 1 : 0
        ]
      );
    }

    await db.run('COMMIT');
    res.json({ success: true });
  } catch (error) {
    await db.run('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
});

export default router;