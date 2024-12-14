import express from 'express';
import userRoutes from './users.js';
import actionRoutes from './actions.js';
import academicYearRoutes from './academicYears.js';
import masterRecordRoutes from './masterRecords.js';
import observatoryRoutes from './observatory.js';
import reportRoutes from './reports.js';
import adminRoutes from './admin.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/actions', actionRoutes);
router.use('/academic-years', academicYearRoutes);
router.use('/master-records', masterRecordRoutes);
router.use('/observatory', observatoryRoutes);
router.use('/reports', reportRoutes);
router.use('/admin', adminRoutes);

export default router;