import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule } from '../../store/slices/scheduleSlice';
import api from '../../services/api';
import {
    Plus,
    Edit,
    Trash2,
    Clock,
    X,
    Save,
    Users,
    BookOpen,
    MapPin,
} from 'lucide-react';
import toast from 'react-hot-toast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DEPARTMENTS = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];

const FacultySchedule = () => {
    const dispatch = useDispatch();
    const { schedules, isLoading } = useSelector((state) => state.schedule);

    const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay() === 0 ? 0 : new Date().getDay() - 1]);
    const [showModal, setShowModal] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    const [formData, setFormData] = useState({
        subject: '',
        day: selectedDay,
        startTime: '',
        endTime: '',
        department: '',
        year: '',
        room: '',
    });

    useEffect(() => {
        dispatch(getSchedules());
    }, [dispatch]);

    const daySchedules = schedules.filter((s) => s.day === selectedDay);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editingSchedule) {
            const result = await dispatch(updateSchedule({ id: editingSchedule._id, data: formData }));
            if (updateSchedule.fulfilled.match(result)) {
                toast.success('Schedule updated successfully');
                setShowModal(false);
                setEditingSchedule(null);
                resetForm();
            }
        } else {
            const result = await dispatch(createSchedule(formData));
            if (createSchedule.fulfilled.match(result)) {
                toast.success('Schedule created successfully');
                setShowModal(false);
                resetForm();
            }
        }
    };

    const handleEdit = (schedule) => {
        setEditingSchedule(schedule);
        setFormData({
            subject: schedule.subject,
            day: schedule.day,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            department: schedule.department,
            year: schedule.year.toString(),
            room: schedule.room,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this schedule?')) {
            const result = await dispatch(deleteSchedule(id));
            if (deleteSchedule.fulfilled.match(result)) {
                toast.success('Schedule deleted successfully');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            subject: '',
            day: selectedDay,
            startTime: '',
            endTime: '',
            department: '',
            year: '',
            room: '',
        });
    };

    const openAddModal = () => {
        setEditingSchedule(null);
        resetForm();
        setFormData((prev) => ({ ...prev, day: selectedDay }));
        setShowModal(true);
    };

    const openAttendanceModal = async (schedule) => {
        setSelectedSchedule(schedule);
        try {
            const response = await api.get('/attendance/students', {
                params: { department: schedule.department, year: schedule.year }
            });
            setStudents(response.data.students);
            setAttendanceRecords(response.data.students.map((s) => ({ studentId: s._id, status: 'present' })));
            setShowAttendanceModal(true);
        } catch (error) {
            toast.error('Failed to load students');
        }
    };

    const toggleAttendance = (studentId) => {
        setAttendanceRecords((prev) =>
            prev.map((r) =>
                r.studentId === studentId
                    ? { ...r, status: r.status === 'present' ? 'absent' : 'present' }
                    : r
            )
        );
    };

    const submitAttendance = async () => {
        try {
            await api.post('/attendance', {
                scheduleId: selectedSchedule._id,
                date: new Date().toISOString(),
                records: attendanceRecords,
            });
            toast.success('Attendance marked successfully');
            setShowAttendanceModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to mark attendance');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Schedule Management</h1>
                    <p className="text-gray-500">Manage your class schedules and mark attendance</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-xl font-medium hover:opacity-90 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Class
                </button>
            </div>

            {/* Day Selector */}
            <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`day-btn ${selectedDay === day ? 'active' : ''}`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* Schedule List */}
            <div className="bg-white rounded-xl shadow-soft">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">{selectedDay}'s Schedule</h2>
                </div>
                <div className="p-6">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="spinner"></div>
                        </div>
                    ) : daySchedules.length > 0 ? (
                        <div className="space-y-4">
                            {daySchedules.map((schedule) => (
                                <div
                                    key={schedule._id}
                                    className={`p-4 rounded-xl border-2 ${schedule.isCancelled ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                                                <BookOpen className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{schedule.subject}</h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {schedule.startTime} - {schedule.endTime}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-4 h-4" />
                                                        {schedule.department} - Year {schedule.year}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        Room {schedule.room}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openAttendanceModal(schedule)}
                                                className="px-3 py-2 bg-green-100 text-green-600 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                                            >
                                                Mark Attendance
                                            </button>
                                            <button
                                                onClick={() => handleEdit(schedule)}
                                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-5 h-5 text-gray-600" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(schedule._id)}
                                                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5 text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Classes Scheduled</h3>
                            <p className="text-gray-500 mb-4">You don't have any classes on {selectedDay}</p>
                            <button
                                onClick={openAddModal}
                                className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-700 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Add a Class
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 modal-overlay">
                    <div className="bg-white rounded-2xl w-full max-w-lg slide-in">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingSchedule ? 'Edit Schedule' : 'Add New Class'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="e.g., Data Structures"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                                    <select
                                        name="day"
                                        value={formData.day}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    >
                                        {DAYS.map((day) => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Room</label>
                                    <input
                                        type="text"
                                        name="room"
                                        value={formData.room}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="e.g., A101"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {DEPARTMENTS.map((dept) => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                                    <select
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    >
                                        <option value="">Select Year</option>
                                        <option value="1">1st Year</option>
                                        <option value="2">2nd Year</option>
                                        <option value="3">3rd Year</option>
                                        <option value="4">4th Year</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save className="w-5 h-5" />
                                    {editingSchedule ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Attendance Modal */}
            {showAttendanceModal && selectedSchedule && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 modal-overlay">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col slide-in">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Mark Attendance</h2>
                                <p className="text-sm text-gray-500">{selectedSchedule.subject} - {new Date().toLocaleDateString()}</p>
                            </div>
                            <button
                                onClick={() => setShowAttendanceModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            {students.length > 0 ? (
                                <div className="space-y-2">
                                    {students.map((student) => {
                                        const record = attendanceRecords.find((r) => r.studentId === student._id);
                                        return (
                                            <div
                                                key={student._id}
                                                onClick={() => toggleAttendance(student._id)}
                                                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors ${record?.status === 'present'
                                                        ? 'bg-green-50 border-2 border-green-200'
                                                        : 'bg-red-50 border-2 border-red-200'
                                                    }`}
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-800">{student.name}</p>
                                                    <p className="text-sm text-gray-500">{student.rollNumber}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${record?.status === 'present'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {record?.status === 'present' ? 'Present' : 'Absent'}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No students found for this class
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t border-gray-100">
                            <button
                                onClick={submitAttendance}
                                className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:opacity-90 transition-all"
                            >
                                Submit Attendance
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultySchedule;
