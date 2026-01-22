import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTimetable } from '../../store/slices/scheduleSlice';
import { Clock, BookOpen, User, MapPin, AlertCircle } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const StudentTimetable = () => {
    const dispatch = useDispatch();
    const { timetable, isLoading } = useSelector((state) => state.schedule);
    const { user } = useSelector((state) => state.auth);

    const [selectedDay, setSelectedDay] = useState(() => {
        const today = new Date().getDay();
        return today === 0 ? 'Monday' : DAYS[today - 1];
    });

    useEffect(() => {
        dispatch(getTimetable());
    }, [dispatch]);

    const dayClasses = timetable?.[selectedDay] || [];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">My Timetable</h1>
                <p className="text-gray-500">
                    {user?.department} - Year {user?.year} • Updates in real-time
                </p>
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

            {/* Timetable */}
            <div className="bg-white rounded-xl shadow-soft">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">{selectedDay}'s Classes</h2>
                </div>
                <div className="p-6">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="spinner"></div>
                        </div>
                    ) : dayClasses.length > 0 ? (
                        <div className="space-y-4">
                            {dayClasses.map((cls) => (
                                <div
                                    key={cls._id}
                                    className={`p-4 rounded-xl border-2 transition-all ${cls.isCancelled
                                            ? 'border-red-200 bg-red-50 opacity-60'
                                            : cls.isRescheduled
                                                ? 'border-amber-200 bg-amber-50'
                                                : 'border-gray-100 bg-gray-50 hover:border-primary-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${cls.isCancelled ? 'bg-red-100 text-red-600' :
                                                cls.isRescheduled ? 'bg-amber-100 text-amber-600' :
                                                    'bg-primary-100 text-primary-600'
                                            }`}>
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className={`font-semibold text-lg ${cls.isCancelled ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                                    {cls.subject}
                                                </h3>
                                                {cls.isRescheduled && (
                                                    <span className="px-2 py-0.5 bg-amber-200 text-amber-800 rounded-full text-xs font-medium flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        Substitute
                                                    </span>
                                                )}
                                                {cls.isCancelled && (
                                                    <span className="px-2 py-0.5 bg-red-200 text-red-800 rounded-full text-xs font-medium">
                                                        Cancelled
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <User className="w-4 h-4" />
                                                    {cls.isRescheduled && cls.substituteFacultyId
                                                        ? cls.substituteFacultyId.name
                                                        : cls.facultyId?.name}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {cls.startTime} - {cls.endTime}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    Room {cls.room}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Classes</h3>
                            <p className="text-gray-500">You don't have any classes on {selectedDay}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Weekly Overview */}
            <div className="bg-white rounded-xl shadow-soft">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Weekly Overview</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {DAYS.map((day) => {
                            const count = timetable?.[day]?.length || 0;
                            return (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDay(day)}
                                    className={`p-4 rounded-xl text-center transition-all ${selectedDay === day
                                            ? 'bg-primary-100 border-2 border-primary-300'
                                            : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                                        }`}
                                >
                                    <p className="text-sm text-gray-500">{day.slice(0, 3)}</p>
                                    <p className={`text-2xl font-bold ${count > 0 ? 'text-primary-600' : 'text-gray-300'
                                        }`}>
                                        {count}
                                    </p>
                                    <p className="text-xs text-gray-400">classes</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentTimetable;
