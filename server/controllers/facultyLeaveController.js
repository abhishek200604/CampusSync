import FacultyLeave from '../models/FacultyLeave.js';
import Schedule from '../models/Schedule.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// Helper to get day name from date
const getDayName = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(date).getDay()];
};

// Helper to get all days between two dates
const getDaysBetween = (startDate, endDate) => {
    const days = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
        const dayName = getDayName(current);
        if (dayName !== 'Sunday') { // Exclude Sundays
            days.push({
                date: new Date(current),
                day: dayName
            });
        }
        current.setDate(current.getDate() + 1);
    }

    return days;
};

// @desc    Check if faculty has lectures on leave dates
// @route   POST /api/faculty-leave/check
// @access  Private (Faculty)
export const checkLeaveConflicts = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;

        const leaveDays = getDaysBetween(startDate, endDate);
        const dayNames = [...new Set(leaveDays.map(d => d.day))];

        // Find schedules on these days
        const conflictingSchedules = await Schedule.find({
            facultyId: req.user._id,
            day: { $in: dayNames },
            isCancelled: false
        }).populate('facultyId', 'name');

        // Map schedules to specific dates
        const conflicts = [];
        leaveDays.forEach(leaveDay => {
            const daySchedules = conflictingSchedules.filter(s => s.day === leaveDay.day);
            daySchedules.forEach(schedule => {
                conflicts.push({
                    scheduleId: schedule._id,
                    subject: schedule.subject,
                    day: schedule.day,
                    date: leaveDay.date,
                    startTime: schedule.startTime,
                    endTime: schedule.endTime,
                    department: schedule.department,
                    year: schedule.year
                });
            });
        });

        res.status(200).json({
            success: true,
            hasConflicts: conflicts.length > 0,
            conflicts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Apply for faculty leave
// @route   POST /api/faculty-leave
// @access  Private (Faculty)
export const applyLeave = async (req, res) => {
    try {
        const { startDate, endDate, reason, substitutions } = req.body;

        // Check for conflicting schedules
        const leaveDays = getDaysBetween(startDate, endDate);
        const dayNames = [...new Set(leaveDays.map(d => d.day))];

        const conflictingSchedules = await Schedule.find({
            facultyId: req.user._id,
            day: { $in: dayNames },
            isCancelled: false
        });

        // If there are conflicts, substitutions must be provided
        if (conflictingSchedules.length > 0 && (!substitutions || substitutions.length === 0)) {
            return res.status(400).json({
                success: false,
                message: 'You have lectures scheduled. Please assign substitutes for each slot.',
                requiresSubstitution: true,
                conflicts: conflictingSchedules
            });
        }

        // Create faculty leave record
        const facultyLeave = await FacultyLeave.create({
            facultyId: req.user._id,
            startDate,
            endDate,
            reason,
            substitutions: substitutions || []
        });

        // Update schedules with substitutes
        if (substitutions && substitutions.length > 0) {
            for (const sub of substitutions) {
                await Schedule.findByIdAndUpdate(sub.scheduleId, {
                    isRescheduled: true,
                    substituteFacultyId: sub.substituteFacultyId,
                    originalFacultyId: req.user._id,
                    rescheduledDate: sub.date
                });

                // Notify substitute faculty
                await Notification.create({
                    recipientId: sub.substituteFacultyId,
                    senderId: req.user._id,
                    type: 'substitute_request',
                    title: 'Substitute Request',
                    message: `${req.user.name} has assigned you as substitute for ${sub.subject || 'a class'} on ${new Date(sub.date).toLocaleDateString()}`,
                    relatedId: sub.scheduleId,
                    relatedModel: 'Schedule'
                });

                // Emit socket event to substitute faculty
                const io = req.app.get('io');
                io.to(sub.substituteFacultyId.toString()).emit('notification_received', {
                    type: 'substitute_request',
                    title: 'Substitute Request',
                    message: `${req.user.name} has assigned you as substitute`
                });

                // Get schedule details for student notification
                const schedule = await Schedule.findById(sub.scheduleId);
                if (schedule) {
                    // Notify students about substitute
                    io.to(`${schedule.department}-${schedule.year}`).emit('schedule_update', {
                        type: 'substitute_assigned',
                        schedule: await Schedule.findById(sub.scheduleId)
                            .populate('facultyId', 'name email')
                            .populate('substituteFacultyId', 'name email')
                    });
                }
            }
        }

        res.status(201).json({
            success: true,
            message: 'Leave application submitted successfully',
            facultyLeave
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get faculty leaves
// @route   GET /api/faculty-leave
// @access  Private (Faculty)
export const getLeaves = async (req, res) => {
    try {
        const leaves = await FacultyLeave.find({ facultyId: req.user._id })
            .populate('substitutions.substituteFacultyId', 'name email')
            .populate('substitutions.scheduleId', 'subject day startTime endTime')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: leaves.length,
            leaves
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get available substitute faculty
// @route   GET /api/faculty-leave/substitutes
// @access  Private (Faculty)
export const getAvailableSubstitutes = async (req, res) => {
    try {
        const { day, startTime, endTime } = req.query;

        // Get all faculty except current user
        const allFaculty = await User.find({
            role: 'faculty',
            _id: { $ne: req.user._id },
            isActive: true
        }).select('name email department designation');

        // If day and time provided, filter out busy faculty
        if (day && startTime && endTime) {
            const busyFacultySchedules = await Schedule.find({
                day,
                isCancelled: false,
                $or: [
                    { startTime: { $lt: endTime, $gte: startTime } },
                    { endTime: { $gt: startTime, $lte: endTime } },
                    { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
                ]
            }).select('facultyId');

            const busyFacultyIds = busyFacultySchedules.map(s => s.facultyId.toString());

            const availableFaculty = allFaculty.filter(
                f => !busyFacultyIds.includes(f._id.toString())
            );

            return res.status(200).json({
                success: true,
                count: availableFaculty.length,
                faculty: availableFaculty
            });
        }

        res.status(200).json({
            success: true,
            count: allFaculty.length,
            faculty: allFaculty
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Cancel faculty leave
// @route   DELETE /api/faculty-leave/:id
// @access  Private (Faculty)
export const cancelLeave = async (req, res) => {
    try {
        const leave = await FacultyLeave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: 'Leave not found'
            });
        }

        if (leave.facultyId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this leave'
            });
        }

        // Revert schedule substitutions
        for (const sub of leave.substitutions) {
            await Schedule.findByIdAndUpdate(sub.scheduleId, {
                isRescheduled: false,
                substituteFacultyId: null,
                originalFacultyId: null,
                rescheduledDate: null
            });
        }

        await leave.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Leave cancelled successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
