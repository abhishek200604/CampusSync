import express from 'express';
import {
    checkLeaveConflicts,
    applyLeave,
    getLeaves,
    getAvailableSubstitutes,
    cancelLeave
} from '../controllers/facultyLeaveController.js';
import { protect, isFaculty } from '../middleware/auth.js';

const router = express.Router();

// All routes are faculty only
router.use(protect, isFaculty);

router.post('/check', checkLeaveConflicts);
router.post('/', applyLeave);
router.get('/', getLeaves);
router.get('/substitutes', getAvailableSubstitutes);
router.delete('/:id', cancelLeave);

export default router;
