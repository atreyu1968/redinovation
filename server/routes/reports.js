import express from 'express';
import { db } from '../database.js';

const router = express.Router();

// Get report data with filters
router.get('/', async (req, res) => {
  try {
    let query = 'SELECT * FROM actions WHERE 1=1';
    const params = [];

    // Apply filters
    if (req.query.startDate) {
      query += ' AND startDate >= ?';
      params.push(req.query.startDate);
    }

    if (req.query.endDate) {
      query += ' AND endDate <= ?';
      params.push(req.query.endDate);
    }

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

    // Get actions with relationships
    const actions = await db.all(query, params);
    const actionDepartments = await db.all('SELECT * FROM action_departments');
    const actionFamilies = await db.all('SELECT * FROM action_families');
    const actionObjectives = await db.all('SELECT * FROM action_objectives');

    // Map relationships to actions
    const fullActions = actions.map(action => ({
      ...action,
      departments: actionDepartments
        .filter(ad => ad.actionId === action.id)
        .map(ad => ad.departmentCode),
      professionalFamilies: actionFamilies
        .filter(af => af.actionId === action.id)
        .map(af => af.familyCode),
      objectives: actionObjectives
        .filter(ao => ao.actionId === action.id)
        .map(ao => ao.objectiveId),
    }));

    // Calculate statistics
    const stats = {
      totalActions: fullActions.length,
      totalStudents: fullActions.reduce((sum, a) => sum + a.studentParticipants, 0),
      totalTeachers: fullActions.reduce((sum, a) => sum + a.teacherParticipants, 0),
      averageRating: fullActions.reduce((sum, a) => sum + a.rating, 0) / fullActions.length || 0,
      
      byNetwork: {},
      byCenter: {},
      byDepartment: {},
      byObjective: {},
    };

    // Group by network
    fullActions.forEach(action => {
      if (!stats.byNetwork[action.network]) {
        stats.byNetwork[action.network] = {
          count: 0,
          students: 0,
          teachers: 0,
        };
      }
      stats.byNetwork[action.network].count++;
      stats.byNetwork[action.network].students += action.studentParticipants;
      stats.byNetwork[action.network].teachers += action.teacherParticipants;
    });

    // Group by center
    fullActions.forEach(action => {
      if (!stats.byCenter[action.center]) {
        stats.byCenter[action.center] = {
          count: 0,
          students: 0,
          teachers: 0,
        };
      }
      stats.byCenter[action.center].count++;
      stats.byCenter[action.center].students += action.studentParticipants;
      stats.byCenter[action.center].teachers += action.teacherParticipants;
    });

    // Group by department
    fullActions.forEach(action => {
      action.departments.forEach(dept => {
        if (!stats.byDepartment[dept]) {
          stats.byDepartment[dept] = {
            count: 0,
            students: 0,
            teachers: 0,
          };
        }
        stats.byDepartment[dept].count++;
        stats.byDepartment[dept].students += action.studentParticipants;
        stats.byDepartment[dept].teachers += action.teacherParticipants;
      });
    });

    // Group by objective
    fullActions.forEach(action => {
      action.objectives.forEach(obj => {
        if (!stats.byObjective[obj]) {
          stats.byObjective[obj] = {
            count: 0,
            students: 0,
            teachers: 0,
          };
        }
        stats.byObjective[obj].count++;
        stats.byObjective[obj].students += action.studentParticipants;
        stats.byObjective[obj].teachers += action.teacherParticipants;
      });
    });

    res.json({
      actions: fullActions,
      stats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;