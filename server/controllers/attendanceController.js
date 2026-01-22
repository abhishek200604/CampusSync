import Attendance from '../models/Attendance.js';
import Schedule from '../models/Schedule.js';
import User from '../models/User.js';

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Private (Faculty)
export const markAttendance = async (req, res) => {
    try {
        const { scheduleId, date, records } = req.body;

        // Verify schedule exists
        const schedule = await Schedule.findById(scheduleId);
        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: 'Schedule not found'
            });
        }

        // Check if faculty is authorized (owner or substitute)
        const isAuthorized =
            schedule.facultyId.toString() === req.user._id.toString() ||
            (schedule.substituteFacultyId && schedule.substituteFacultyId.toString() === req.user._id.toString());

        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to mark attendance for this class'
            });
        }

        // Check if attendance already exists for this schedule and date
        const existingAttendance = await Attendance.findOne({
            scheduleId,
            date: new Date(date).setHours(0, 0, 0, 0)
        });

        if (existingAttendance) {
            // Update existing attendance
            existingAttendance.records = records;
            existingAttendance.markedBy = req.user._id;
            await existingAttendance.save();

            return res.status(200).json({
                success: true,
                message: 'Attendance updated successfully',
                attendance: existingAttendance
            });
        }

        // Create new attendance record
        const attendance = await Attendance.create({
            scheduleId,
            date: new Date(date).setHours(0, 0, 0, 0),
            department: schedule.department,
            year: schedule.year,
            markedBy: req.user._id,
            records
        });

        res.status(201).json({
            success: true,
            message: 'Attendance marked successfully',
            attendance
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Attendance already marked for this class on this date'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get attendance for a schedule
// @route   GET /api/attendance/schedule/:scheduleId
// @access  Private (Faculty)
export const getAttendanceBySchedule = async (req, res) => {
    try {
        const { date } = req.query;

        const filter = { scheduleId: req.params.scheduleId };
        if (date) {
            filter.date = new Date(date).setHours(0, 0, 0, 0);
        }

        const attendance = await Attendance.find(filter)
            .populate('records.studentId', 'name rollNumber')
            .populate('markedBy', 'name')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: attendance.length,
            attendance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get students for attendance marking
// @route   GET /api/attendance/students
// @access  Private (Faculty)
export const getStudentsForAttendance = async (req, res) => {
    try {
        const { department, year } = req.query;

        const students = await User.find({
            role: 'student',
            department,
            year: parseInt(year),
            isActive: true
        })
            .select('name rollNumber email')
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

// @desc    Get student's own attendance
// @route   GET /api/attendance/my
// @access  Private (Student)
export const getMyAttendance = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const filter = {
            department: req.user.department,
            year: req.user.year,
            'records.studentId': req.user._id
        };

        if (startDate && endDate) {
            filter.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const attendanceRecords = await Attendance.find(filter)
            .populate('scheduleId', 'subject day startTime endTime')
            .sort({ date: -1 });

        // Calculate attendance percentage
        let totalClasses = 0;
        let presentCount = 0;

        attendanceRecords.forEach(record => {
            const studentRecord = record.records.find(
                r => r.studentId.toString() === req.user._id.toString()
            );
            if (studentRecord) {
                totalClasses++;
                if (studentRecord.status === 'present') {
                    presentCount++;
                }
            }
        });

        const percentage = totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(2) : 0;

        res.status(200).json({
            success: true,
            attendance: {
                records: attendanceRecords,
                summary: {
                    totalClasses,
                    present: presentCount,
                    absent: totalClasses - presentCount,
                    percentage: parseFloat(percentage)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get attendance statistics for a class
// @route   GET /api/attendance/stats/:scheduleId
// @access  Private (Faculty)
export const getAttendanceStats = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.scheduleId);

        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: 'Schedule not found'
            });
        }

        const attendanceRecords = await Attendance.find({
            scheduleId: req.params.scheduleId
        });

        // Get all students
        const students = await User.find({
            role: 'student',
            department: schedule.department,
            year: schedule.year,
            isActive: true
        }).select('name rollNumber');

        // Calculate stats per student
        const stats = students.map(student => {
            let present = 0;
            let absent = 0;

            attendanceRecords.forEach(record => {
                const studentRecord = record.records.find(
                    r => r.studentId.toString() === student._id.toString()
                );
                if (studentRecord) {
                    if (studentRecord.status === 'present') {
                        present++;
                    } else {
                        absent++;
                    }
                }
            });

            const total = present + absent;
            const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

            return {
                student: {
                    _id: student._id,
                    name: student.name,
                    rollNumber: student.rollNumber
                },
                present,
                absent,
                total,
                percentage: parseFloat(percentage)
            };
        });

        res.status(200).json({
            success: true,
            totalSessions: attendanceRecords.length,
            stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
