import express from 'express';
import {
    createApplication,
    getApplications,
    getApplication,
    reviewApplication,
    getPendingCount
} from '../controllers/applicationController.js';
import { protect, isFaculty, isStudent } from '../middleware/auth.js';

const router = express.Router();

// Student routes
router.post('/', protect, isStudent, createApplication);

// Faculty routes
router.put('/:id/review', protect, isFaculty, reviewApplication);
router.get('/pending/count', protect, isFaculty, getPendingCount);

// Shared routes
router.get('/', protect, getApplications);
router.get('/:id', protect, getApplication);

export default router;
