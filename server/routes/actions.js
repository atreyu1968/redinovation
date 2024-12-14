import express from 'express';
import { db } from '../database.js';

const router = express.Router();

// Get all actions with filters
router.get('/', async (req, res) => {
  try {
    let query = 'SELECT * FROM actions WHERE 1=1';
    const params = [];

    // Apply filters
    if (req.query.network) {
      query += ' AND network = ?';
      params.push(req.query.network);
    }

    if (req.query.center) {
      query += ' AND center = ?';
      params.push(req.query.center);
    }

    if (req.query.quarter) {
      query += ' AND quarter = ?';
      params.push(req.query.quarter);
    }

    if (req.query.startDate) {
      query += ' AND startDate >= ?';
      params.push(req.query.startDate);
    }

    if (req.query.endDate) {
      query += ' AND endDate <= ?';
      params.push(req.query.endDate);
    }

    const actions = await db.all(query, params);

    // Get related data
    const actionDepartments = await db.all('SELECT * FROM action_departments');
    const actionFamilies = await db.all('SELECT * FROM action_families');
    const actionGroups = await db.all('SELECT * FROM action_groups');
    const actionObjectives = await db.all('SELECT * FROM action_objectives');

    // Map related data to actions
    const fullActions = actions.map(action => ({
      ...action,
      departments: actionDepartments
        .filter(ad => ad.actionId === action.id)
        .map(ad => ad.departmentCode),
      professionalFamilies: actionFamilies
        .filter(af => af.actionId === action.id)
        .map(af => af.familyCode),
      selectedGroups: actionGroups
        .filter(ag => ag.actionId === action.id)
        .map(ag => ag.groupId),
      objectives: actionObjectives
        .filter(ao => ao.actionId === action.id)
        .map(ao => ao.objectiveId),
    }));

    res.json(fullActions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create action
router.post('/', async (req, res) => {
  try {
    const {
      name,
      location,
      description,
      startDate,
      endDate,
      departments,
      professionalFamilies,
      selectedGroups,
      studentParticipants,
      teacherParticipants,
      rating,
      comments,
      createdBy,
      network,
      center,
      quarter,
      objectives,
    } = req.body;

    await db.run('BEGIN TRANSACTION');

    // Insert action
    const actionId = Date.now().toString();
    await db.run(
      `INSERT INTO actions (
        id, name, location, description, startDate, endDate,
        studentParticipants, teacherParticipants, rating, comments,
        createdBy, network, center, quarter
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        actionId, name, location, description, startDate, endDate,
        studentParticipants, teacherParticipants, rating, comments,
        createdBy, network, center, quarter
      ]
    );

    // Insert relationships
    for (const code of departments) {
      await db.run(
        'INSERT INTO action_departments (actionId, departmentCode) VALUES (?, ?)',
        [actionId, code]
      );
    }

    for (const code of professionalFamilies) {
      await db.run(
        'INSERT INTO action_families (actionId, familyCode) VALUES (?, ?)',
        [actionId, code]
      );
    }

    for (const groupId of selectedGroups) {
      await db.run(
        'INSERT INTO action_groups (actionId, groupId) VALUES (?, ?)',
        [actionId, groupId]
      );
    }

    for (const objectiveId of objectives) {
      await db.run(
        'INSERT INTO action_objectives (actionId, objectiveId) VALUES (?, ?)',
        [actionId, objectiveId]
      );
    }

    await db.run('COMMIT');
    res.status(201).json({ id: actionId });
  } catch (error) {
    await db.run('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
});

// Update action
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      location,
      description,
      startDate,
      endDate,
      departments,
      professionalFamilies,
      selectedGroups,
      studentParticipants,
      teacherParticipants,
      rating,
      comments,
      network,
      center,
      quarter,
      objectives,
    } = req.body;

    await db.run('BEGIN TRANSACTION');

    // Update action
    await db.run(
      `UPDATE actions SET
        name = ?, location = ?, description = ?, startDate = ?, endDate = ?,
        studentParticipants = ?, teacherParticipants = ?, rating = ?, comments = ?,
        network = ?, center = ?, quarter = ?
      WHERE id = ?`,
      [
        name, location, description, startDate, endDate,
        studentParticipants, teacherParticipants, rating, comments,
        network, center, quarter, id
      ]
    );

    // Update relationships
    await db.run('DELETE FROM action_departments WHERE actionId = ?', [id]);
    await db.run('DELETE FROM action_families WHERE actionId = ?', [id]);
    await db.run('DELETE FROM action_groups WHERE actionId = ?', [id]);
    await db.run('DELETE FROM action_objectives WHERE actionId = ?', [id]);

    for (const code of departments) {
      await db.run(
        'INSERT INTO action_departments (actionId, departmentCode) VALUES (?, ?)',
        [id, code]
      );
    }

    for (const code of professionalFamilies) {
      await db.run(
        'INSERT INTO action_families (actionId, familyCode) VALUES (?, ?)',
        [id, code]
      );
    }

    for (const groupId of selectedGroups) {
      await db.run(
        'INSERT INTO action_groups (actionId, groupId) VALUES (?, ?)',
        [id, groupId]
      );
    }

    for (const objectiveId of objectives) {
      await db.run(
        'INSERT INTO action_objectives (actionId, objectiveId) VALUES (?, ?)',
        [id, objectiveId]
      );
    }

    await db.run('COMMIT');
    res.json({ success: true });
  } catch (error) {
    await db.run('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
});

// Delete action
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.run('BEGIN TRANSACTION');

    // Delete relationships first
    await db.run('DELETE FROM action_departments WHERE actionId = ?', [id]);
    await db.run('DELETE FROM action_families WHERE actionId = ?', [id]);
    await db.run('DELETE FROM action_groups WHERE actionId = ?', [id]);
    await db.run('DELETE FROM action_objectives WHERE actionId = ?', [id]);

    // Delete action
    await db.run('DELETE FROM actions WHERE id = ?', [id]);

    await db.run('COMMIT');
    res.json({ success: true });
  } catch (error) {
    await db.run('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
});

export default router;