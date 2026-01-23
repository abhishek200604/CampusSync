import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getSchedules } from '../../store/slices/scheduleSlice';
import { getPendingCount } from '../../store/slices/applicationSlice';
import { getUnreadCount } from '../../store/slices/notificationSlice';
import {
    Calendar,
    Users,
    Bell,
    Clock,
    ChevronRight,
    BookOpen,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';

const FacultyDashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { schedules } = useSelector((state) => state.schedule);
    const { pendingCount } = useSelector((state) => state.application);
    const { unreadCount } = useSelector((state) => state.notification);

    const [currentDay, setCurrentDay] = useState('');

    useEffect(() => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        setCurrentDay(days[new Date().getDay()]);

        dispatch(getSchedules());
        dispatch(getPendingCount());
        dispatch(getUnreadCount());
    }, [dispatch]);

    const todaySchedules = schedules.filter((s) => s.day === currentDay && !s.isCancelled);

    const stats = [
        {
            label: 'Today\'s Classes',
            value: todaySchedules.length,
            icon: Calendar,
            color: 'from-blue-500 to-cyan-500',
            link: '/faculty/schedule',
        },
        {
            label: 'Pending Applications',
            value: pendingCount,
            icon: Users,
            color: 'from-orange-500 to-amber-500',
            link: '/faculty/notifications',
        },
        {
            label: 'Unread Notifications',
            value: unreadCount,
            icon: Bell,
            color: 'from-purple-500 to-pink-500',
            link: '/faculty/notifications',
        },
        {
            label: 'Total Classes',
            value: schedules.length,
            icon: BookOpen,
            color: 'from-green-500 to-emerald-500',
            link: '/faculty/schedule',
        },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">
                    Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-white/80">
                    Here's what's happening with your schedule today, {currentDay}.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <Link
                        key={index}
                        to={stat.link}
                        className="bg-white rounded-xl p-6 shadow-soft card-hover"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Today's Schedule */}
            <div className="bg-white rounded-xl shadow-soft">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">Today's Schedule</h2>
                    <Link
                        to="/faculty/schedule"
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
                    >
                        View All <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="p-6">
                    {todaySchedules.length > 0 ? (
                        <div className="space-y-4">
                            {todaySchedules.map((schedule) => (
                                <div
                                    key={schedule._id}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">{schedule.subject}</h3>
                                        <p className="text-sm text-gray-500">
                                            {schedule.department} - Year {schedule.year} • Room {schedule.room}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-800">
                                            {schedule.startTime} - {schedule.endTime}
                                        </p>
                                        {schedule.isRescheduled && (
                                            <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                                <AlertCircle className="w-3 h-3" />
                                                Substitute Assigned
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Classes Today!</h3>
                            <p className="text-gray-500">Enjoy your free time or catch up on other work.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                    to="/faculty/schedule"
                    className="p-6 bg-white rounded-xl shadow-soft hover:shadow-lg transition-all flex items-center gap-4"
                >
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">Manage Schedule</h3>
                        <p className="text-sm text-gray-500">Add or edit your classes</p>
                    </div>
                </Link>

                <Link
                    to="/faculty/leave"
                    className="p-6 bg-white rounded-xl shadow-soft hover:shadow-lg transition-all flex items-center gap-4"
                >
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">Apply for Leave</h3>
                        <p className="text-sm text-gray-500">Request time off</p>
                    </div>
                </Link>

                <Link
                    to="/faculty/notifications"
                    className="p-6 bg-white rounded-xl shadow-soft hover:shadow-lg transition-all flex items-center gap-4"
                >
                    <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">Review Applications</h3>
                        <p className="text-sm text-gray-500">{pendingCount} pending requests</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default FacultyDashboard;
