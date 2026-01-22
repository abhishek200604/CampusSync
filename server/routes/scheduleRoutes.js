import express from 'express';
import {
    createSchedule,
    getSchedules,
    getSchedule,
    updateSchedule,
    deleteSchedule,
    cancelSchedule,
    assignSubstitute,
    getSchedulesByDay,
    getStudentTimetable
} from '../controllers/scheduleController.js';
import { protect, isFaculty, isStudent } from '../middleware/auth.js';

const router = express.Router();

// Faculty routes
router.post('/', protect, isFaculty, createSchedule);
router.put('/:id', protect, isFaculty, updateSchedule);
router.delete('/:id', protect, isFaculty, deleteSchedule);
router.put('/:id/cancel', protect, isFaculty, cancelSchedule);
router.put('/:id/substitute', protect, isFaculty, assignSubstitute);
router.get('/day/:day', protect, isFaculty, getSchedulesByDay);

// Student routes
router.get('/timetable', protect, isStudent, getStudentTimetable);

// Shared routes
router.get('/', protect, getSchedules);
router.get('/:id', protect, getSchedule);

export default router;
