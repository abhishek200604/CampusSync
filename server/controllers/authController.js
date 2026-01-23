import User from '../models/User.js';
import { generateToken, setTokenCookie } from '../middleware/auth.js';

// @desc    Register user (Student or Faculty)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password, role, department, rollNumber, year, designation } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Validate role-specific fields
        if (role === 'student') {
            if (!rollNumber || !year) {
                return res.status(400).json({
                    success: false,
                    message: 'Roll number and year are required for students'
                });
            }
        }

        if (role === 'faculty') {
            if (!designation) {
                return res.status(400).json({
                    success: false,
                    message: 'Designation is required for faculty'
                });
            }
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role,
            department,
            rollNumber: role === 'student' ? rollNumber : undefined,
            year: role === 'student' ? year : undefined,
            designation: role === 'faculty' ? designation : undefined
        });

        // Generate token
        const token = generateToken(user._id);
        setTokenCookie(res, token);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                rollNumber: user.rollNumber,
                year: user.year,
                designation: user.designation
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if role matches
        if (role && user.role !== role) {
            return res.status(401).json({
                success: false,
                message: `This account is registered as ${user.role}, not ${role}`
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id);
        setTokenCookie(res, token);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                rollNumber: user.rollNumber,
                year: user.year,
                designation: user.designation
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const { name, department, designation } = req.body;

        const updateFields = {};
        if (name) updateFields.name = name;
        if (department) updateFields.department = department;
        if (designation && req.user.role === 'faculty') updateFields.designation = designation;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateFields,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all faculty members
// @route   GET /api/auth/faculty
// @access  Private (Faculty)
export const getAllFaculty = async (req, res) => {
    try {
        const faculty = await User.find({ role: 'faculty', isActive: true })
            .select('name email department designation')
            .sort('name');

        res.status(200).json({
            success: true,
            count: faculty.length,
            faculty
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all students by department and year
// @route   GET /api/auth/students
// @access  Private (Faculty)
export const getStudents = async (req, res) => {
    try {
        const { department, year } = req.query;

        const filter = { role: 'student', isActive: true };
        if (department) filter.department = department;
        if (year) filter.year = parseInt(year);

        const students = await User.find(filter)
            .select('name email rollNumber department year')
            .sort('rollNumber');

        res.status(200).json({
            success: true,
            count: students.length,
            students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
