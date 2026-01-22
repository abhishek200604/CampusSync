import Application from '../models/Application.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

// @desc    Create application (Student)
// @route   POST /api/application
// @access  Private (Student)
export const createApplication = async (req, res) => {
    try {
        const { type, subject, details, startDate, endDate } = req.body;

        const application = await Application.create({
            type,
            subject,
            details,
            startDate,
            endDate,
            studentId: req.user._id
        });

        // Create notification for faculty members in the same department
        const facultyMembers = await User.find({
            role: 'faculty',
            department: req.user.department,
            isActive: true
        });

        const notifications = facultyMembers.map(faculty => ({
            recipientId: faculty._id,
            senderId: req.user._id,
            type: 'leave_request',
            title: `New ${type} Application`,
            message: `${req.user.name} has submitted a ${type} application`,
            relatedId: application._id,
            relatedModel: 'Application'
        }));

        await Notification.insertMany(notifications);

        // Emit socket event
        const io = req.app.get('io');
        facultyMembers.forEach(faculty => {
            io.to(faculty._id.toString()).emit('notification_received', {
                type: 'leave_request',
                title: `New ${type} Application`,
                message: `${req.user.name} has submitted a ${type} application`,
                applicationId: application._id
            });
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get applications
// @route   GET /api/application
// @access  Private
export const getApplications = async (req, res) => {
    try {
        let filter = {};
        const { status, type } = req.query;

        if (req.user.role === 'student') {
            // Students see their own applications
            filter.studentId = req.user._id;
        } else {
            // Faculty sees applications from their department
            const students = await User.find({
                role: 'student',
                department: req.user.department
            }).select('_id');

            filter.studentId = { $in: students.map(s => s._id) };
        }

        if (status) filter.status = status;
        if (type) filter.type = type;

        const applications = await Application.find(filter)
            .populate('studentId', 'name email rollNumber department year')
            .populate('reviewedBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single application
// @route   GET /api/application/:id
// @access  Private
export const getApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('studentId', 'name email rollNumber department year')
            .populate('reviewedBy', 'name email');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.status(200).json({
            success: true,
            application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Review application (Approve/Reject)
// @route   PUT /api/application/:id/review
// @access  Private (Faculty)
export const reviewApplication = async (req, res) => {
    try {
        const { status, remarks } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be approved or rejected'
            });
        }

        let application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        if (application.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Application has already been reviewed'
            });
        }

        application.status = status;
        application.reviewedBy = req.user._id;
        application.reviewedAt = new Date();
        application.reviewRemarks = remarks;
        await application.save();

        application = await application.populate('studentId', 'name email');

        // Create notification for student
        const notification = await Notification.create({
            recipientId: application.studentId._id,
            senderId: req.user._id,
            type: 'application_status',
            title: `Application ${status}`,
            message: `Your ${application.type} application has been ${status}${remarks ? ': ' + remarks : ''}`,
            relatedId: application._id,
            relatedModel: 'Application'
        });

        // Emit socket event
        const io = req.app.get('io');
        io.to(application.studentId._id.toString()).emit('notification_received', {
            type: 'application_status',
            title: `Application ${status}`,
            message: `Your ${application.type} application has been ${status}`,
            applicationId: application._id,
            status
        });

        res.status(200).json({
            success: true,
            message: `Application ${status} successfully`,
            application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get pending applications count
// @route   GET /api/application/pending/count
// @access  Private (Faculty)
export const getPendingCount = async (req, res) => {
    try {
        const students = await User.find({
            role: 'student',
            department: req.user.department
        }).select('_id');

        const count = await Application.countDocuments({
            studentId: { $in: students.map(s => s._id) },
            status: 'pending'
        });

        res.status(200).json({
            success: true,
            count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
