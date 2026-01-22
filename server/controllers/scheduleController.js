import Schedule from '../models/Schedule.js';
import User from '../models/User.js';

// @desc    Create schedule
// @route   POST /api/schedule
// @access  Private (Faculty)
export const createSchedule = async (req, res) => {
    try {
        const { subject, day, startTime, endTime, department, year, room } = req.body;

        const schedule = await Schedule.create({
            subject,
            day,
            startTime,
            endTime,
            facultyId: req.user._id,
            department,
            year,
            room
        });

        // Emit socket event for real-time update
        const io = req.app.get('io');
        io.to(`${department}-${year}`).emit('schedule_update', {
            type: 'created',
            schedule: await schedule.populate('facultyId', 'name email')
        });

        res.status(201).json({
            success: true,
            message: 'Schedule created successfully',
            schedule
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get schedules
// @route   GET /api/schedule
// @access  Private
export const getSchedules = async (req, res) => {
    try {
        const { day, department, year } = req.query;
        let filter = {};

        if (req.user.role === 'faculty') {
            // Faculty sees their own schedules
            filter.facultyId = req.user._id;
        } else {
            // Students see schedules for their department and year
            filter.department = req.user.department;
            filter.year = req.user.year;
        }

        if (day) filter.day = day;
        if (department && req.user.role === 'faculty') filter.department = department;
        if (year && req.user.role === 'faculty') filter.year = parseInt(year);

        const schedules = await Schedule.find(filter)
            .populate('facultyId', 'name email')
            .populate('substituteFacultyId', 'name email')
            .sort({ day: 1, startTime: 1 });

        res.status(200).json({
            success: true,
            count: schedules.length,
            schedules
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single schedule
// @route   GET /api/schedule/:id
// @access  Private
export const getSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id)
            .populate('facultyId', 'name email')
            .populate('substituteFacultyId', 'name email');

        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: 'Schedule not found'
            });
        }

        res.status(200).json({
            success: true,
            schedule
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update schedule
// @route   PUT /api/schedule/:id
// @access  Private (Faculty)
export const updateSchedule = async (req, res) => {
    try {
        let schedule = await Schedule.findById(req.params.id);

        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: 'Schedule not found'
            });
        }

        // Check ownership
        if (schedule.facultyId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this schedule'
            });
        }

        const { subject, day, startTime, endTime, room, isRescheduled } = req.body;

        schedule = await Schedule.findByIdAndUpdate(
            req.params.id,
            { subject, day, startTime, endTime, room, isRescheduled },
            { new: true, runValidators: true }
        ).populate('facultyId', 'name email');

        // Emit socket event for real-time update
        const io = req.app.get('io');
        io.to(`${schedule.department}-${schedule.year}`).emit('schedule_update', {
            type: 'updated',
            schedule
        });

        res.status(200).json({
            success: true,
            message: 'Schedule updated successfully',
            schedule
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete schedule
// @route   DELETE /api/schedule/:id
// @access  Private (Faculty)
export const deleteSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id);

        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: 'Schedule not found'
            });
        }

        // Check ownership
        if (schedule.facultyId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this schedule'
            });
        }

        const department = schedule.department;
        const year = schedule.year;

        await schedule.deleteOne();

        // Emit socket event for real-time update
        const io = req.app.get('io');
        io.to(`${department}-${year}`).emit('schedule_update', {
            type: 'deleted',
            scheduleId: req.params.id
        });

        res.status(200).json({
            success: true,
            message: 'Schedule deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Cancel schedule
// @route   PUT /api/schedule/:id/cancel
// @access  Private (Faculty)
export const cancelSchedule = async (req, res) => {
    try {
        let schedule = await Schedule.findById(req.params.id);

        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: 'Schedule not found'
            });
        }

        // Check ownership
        if (schedule.facultyId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this schedule'
            });
        }

        schedule.isCancelled = true;
        schedule.cancelReason = req.body.reason || 'Cancelled by faculty';
        await schedule.save();

        schedule = await schedule.populate('facultyId', 'name email');

        // Emit socket event for real-time update
        const io = req.app.get('io');
        io.to(`${schedule.department}-${schedule.year}`).emit('schedule_update', {
            type: 'cancelled',
            schedule
        });

        res.status(200).json({
            success: true,
            message: 'Schedule cancelled successfully',
            schedule
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Assign substitute faculty
// @route   PUT /api/schedule/:id/substitute
// @access  Private (Faculty)
export const assignSubstitute = async (req, res) => {
    try {
        const { substituteFacultyId } = req.body;

        let schedule = await Schedule.findById(req.params.id);

        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: 'Schedule not found'
            });
        }

        // Check ownership
        if (schedule.facultyId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this schedule'
            });
        }

        // Verify substitute faculty exists
        const substituteFaculty = await User.findOne({
            _id: substituteFacultyId,
            role: 'faculty'
        });

        if (!substituteFaculty) {
            return res.status(404).json({
                success: false,
                message: 'Substitute faculty not found'
            });
        }

        schedule.isRescheduled = true;
        schedule.originalFacultyId = schedule.facultyId;
        schedule.substituteFacultyId = substituteFacultyId;
        await schedule.save();

        schedule = await schedule
            .populate('facultyId', 'name email')
            .populate('substituteFacultyId', 'name email');

        // Emit socket event for real-time update
        const io = req.app.get('io');
        io.to(`${schedule.department}-${schedule.year}`).emit('schedule_update', {
            type: 'substitute_assigned',
            schedule
        });

        res.status(200).json({
            success: true,
            message: 'Substitute faculty assigned successfully',
            schedule
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get schedules for a specific day (for leave checking)
// @route   GET /api/schedule/day/:day
// @access  Private (Faculty)
export const getSchedulesByDay = async (req, res) => {
    try {
        const schedules = await Schedule.find({
            facultyId: req.user._id,
            day: req.params.day,
            isCancelled: false
        }).populate('facultyId', 'name email');

        res.status(200).json({
            success: true,
            count: schedules.length,
            schedules
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all schedules for students view
// @route   GET /api/schedule/timetable
// @access  Private (Student)
export const getStudentTimetable = async (req, res) => {
    try {
        const schedules = await Schedule.find({
            department: req.user.department,
            year: req.user.year,
            isCancelled: false
        })
            .populate('facultyId', 'name email')
            .populate('substituteFacultyId', 'name email')
            .sort({ day: 1, startTime: 1 });

        // Group by day
        const timetable = {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: []
        };

        schedules.forEach(schedule => {
            if (timetable[schedule.day]) {
                timetable[schedule.day].push(schedule);
            }
        });

        res.status(200).json({
            success: true,
            timetable
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
