import express from 'express';
import {
    register,
    login,
    logout,
    getMe,
    updateProfile,
    getAllFaculty,
    getStudents
} from '../controllers/authController.js';
import { protect, isFaculty } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/faculty', protect, getAllFaculty);
router.get('/students', protect, isFaculty, getStudents);

export default router;
