import express from 'express';
import { db } from '../database.js';

const router = express.Router();

// Networks
router.get('/networks', async (req, res) => {
  try {
    const networks = await db.all('SELECT * FROM networks');
    res.json(networks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/networks', async (req, res) => {
  try {
    const { code, name, description } = req.body;
    const result = await db.run(
      'INSERT INTO networks (id, code, name, description) VALUES (?, ?, ?, ?)',
      [Date.now().toString(), code, name, description]
    );
    res.status(201).json({ id: result.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Centers
router.get('/centers', async (req, res) => {
  try {
    const centers = await db.all('SELECT * FROM centers');
    res.json(centers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/centers', async (req, res) => {
  try {
    const { code, name, network, address, municipality, province, island, phone, email } = req.body;
    const result = await db.run(
      'INSERT INTO centers (id, code, name, network, address, municipality, province, island, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [Date.now().toString(), code, name, network, address, municipality, province, island, phone, email]
    );
    res.status(201).json({ id: result.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Departments
router.get('/departments', async (req, res) => {
  try {
    const departments = await db.all('SELECT * FROM departments');
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/departments', async (req, res) => {
  try {
    const { code, name, description, headTeacher, email } = req.body;
    const result = await db.run(
      'INSERT INTO departments (id, code, name, description, headTeacher, email) VALUES (?, ?, ?, ?, ?, ?)',
      [Date.now().toString(), code, name, description, headTeacher, email]
    );
    res.status(201).json({ id: result.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Professional Families
router.get('/families', async (req, res) => {
  try {
    const families = await db.all('SELECT * FROM families');
    const studies = await db.all('SELECT * FROM studies');
    const groups = await db.all('SELECT * FROM groups');

    // Map studies and groups to their families
    const familiesWithStudies = families.map(family => ({
      ...family,
      studies: studies
        .filter(study => study.familyId === family.id)
        .map(study => ({
          ...study,
          groups: groups.filter(group => group.studyId === study.id)
        }))
    }));

    res.json(familiesWithStudies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/families', async (req, res) => {
  try {
    const { code, name, description, studies } = req.body;
    
    await db.run('BEGIN TRANSACTION');

    // Create family
    const familyResult = await db.run(
      'INSERT INTO families (id, code, name, description) VALUES (?, ?, ?, ?)',
      [Date.now().toString(), code, name, description]
    );

    // Create studies and groups
    for (const study of studies) {
      const studyResult = await db.run(
        'INSERT INTO studies (id, familyId, code, name, level) VALUES (?, ?, ?, ?, ?)',
        [Date.now().toString(), familyResult.id, study.code, study.name, study.level]
      );

      for (const group of study.groups) {
        await db.run(
          'INSERT INTO groups (id, studyId, code, name, shift, year) VALUES (?, ?, ?, ?, ?, ?)',
          [Date.now().toString(), studyResult.id, group.code, group.name, group.shift, group.year]
        );
      }
    }

    await db.run('COMMIT');
    res.status(201).json({ id: familyResult.id });
  } catch (error) {
    await db.run('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
});

export default router;