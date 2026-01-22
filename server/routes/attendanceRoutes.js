import express from 'express';
import {
    markAttendance,
    getAttendanceBySchedule,
    getStudentsForAttendance,
    getMyAttendance,
    getAttendanceStats
} from '../controllers/attendanceController.js';
import { protect, isFaculty, isStudent } from '../middleware/auth.js';

const router = express.Router();

// Faculty routes
router.post('/', protect, isFaculty, markAttendance);
router.get('/schedule/:scheduleId', protect, isFaculty, getAttendanceBySchedule);
router.get('/students', protect, isFaculty, getStudentsForAttendance);
router.get('/stats/:scheduleId', protect, isFaculty, getAttendanceStats);

// Student routes
router.get('/my', protect, isStudent, getMyAttendance);

export default router;
