import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTimetable } from '../../store/slices/scheduleSlice';
import { getApplications } from '../../store/slices/applicationSlice';
import { getUnreadCount } from '../../store/slices/notificationSlice';
import {
    Calendar,
    Bell,
    FileText,
    Clock,
    ChevronRight,
    BookOpen,
    CheckCircle,
    XCircle,
    AlertCircle,
} from 'lucide-react';

const StudentDashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { timetable } = useSelector((state) => state.schedule);
    const { applications } = useSelector((state) => state.application);
    const { unreadCount } = useSelector((state) => state.notification);

    const [currentDay, setCurrentDay] = useState('');

    useEffect(() => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        setCurrentDay(days[new Date().getDay()]);

        dispatch(getTimetable());
        dispatch(getApplications());
        dispatch(getUnreadCount());
    }, [dispatch]);

    const todayClasses = timetable?.[currentDay] || [];
    const pendingApplications = applications.filter((a) => a.status === 'pending').length;
    const totalClasses = timetable
        ? Object.values(timetable).reduce((acc, day) => acc + day.length, 0)
        : 0;

    const stats = [
        {
            label: 'Today\'s Classes',
            value: todayClasses.length,
            icon: Calendar,
            color: 'from-purple-500 to-pink-500',
            link: '/student/timetable',
        },
        {
            label: 'Pending Applications',
            value: pendingApplications,
            icon: FileText,
            color: 'from-orange-500 to-amber-500',
            link: '/student/applications',
        },
        {
            label: 'Notifications',
            value: unreadCount,
            icon: Bell,
            color: 'from-blue-500 to-cyan-500',
            link: '/student/notifications',
        },
        {
            label: 'Weekly Classes',
            value: totalClasses,
            icon: BookOpen,
            color: 'from-green-500 to-emerald-500',
            link: '/student/timetable',
        },
    ];

    const recentApplications = applications.slice(0, 3);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">
                    Hello, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-white/80">
                    {currentDay}'s schedule and updates for {user?.department} - Year {user?.year}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Schedule */}
                <div className="bg-white rounded-xl shadow-soft">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">Today's Classes</h2>
                        <Link
                            to="/student/timetable"
                            className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
                        >
                            Full Timetable <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="p-6">
                        {todayClasses.length > 0 ? (
                            <div className="space-y-3">
                                {todayClasses.map((cls) => (
                                    <div
                                        key={cls._id}
                                        className={`flex items-center gap-4 p-4 rounded-xl ${cls.isCancelled ? 'bg-red-50 opacity-60' : 'bg-gray-50'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cls.isCancelled ? 'bg-red-100 text-red-600' : 'bg-primary-100 text-primary-600'
                                            }`}>
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`font-semibold ${cls.isCancelled ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                                {cls.subject}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {cls.substituteFacultyId ? cls.substituteFacultyId.name : cls.facultyId?.name}
                                                {cls.isRescheduled && <span className="text-amber-600"> (Substitute)</span>}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-800 text-sm">
                                                {cls.startTime} - {cls.endTime}
                                            </p>
                                            <p className="text-xs text-gray-500">Room {cls.room}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                <h3 className="font-semibold text-gray-800">No Classes Today!</h3>
                                <p className="text-sm text-gray-500">Enjoy your free time</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Applications */}
                <div className="bg-white rounded-xl shadow-soft">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">Recent Applications</h2>
                        <Link
                            to="/student/applications"
                            className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
                        >
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="p-6">
                        {recentApplications.length > 0 ? (
                            <div className="space-y-3">
                                {recentApplications.map((app) => (
                                    <div
                                        key={app._id}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-gray-50"
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${app.status === 'approved' ? 'bg-green-100 text-green-600' :
                                                app.status === 'rejected' ? 'bg-red-100 text-red-600' :
                                                    'bg-amber-100 text-amber-600'
                                            }`}>
                                            {app.status === 'approved' ? <CheckCircle className="w-5 h-5" /> :
                                                app.status === 'rejected' ? <XCircle className="w-5 h-5" /> :
                                                    <AlertCircle className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 capitalize">{app.type} Application</h3>
                                            <p className="text-sm text-gray-500">{app.subject}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${app.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-amber-100 text-amber-700'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <h3 className="font-semibold text-gray-800">No Applications Yet</h3>
                                <p className="text-sm text-gray-500">Submit your first application</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                    to="/student/timetable"
                    className="p-6 bg-white rounded-xl shadow-soft hover:shadow-lg transition-all flex items-center gap-4"
                >
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">View Timetable</h3>
                        <p className="text-sm text-gray-500">Check your weekly schedule</p>
                    </div>
                </Link>

                <Link
                    to="/student/applications"
                    className="p-6 bg-white rounded-xl shadow-soft hover:shadow-lg transition-all flex items-center gap-4"
                >
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">Apply for Leave</h3>
                        <p className="text-sm text-gray-500">Submit a leave request</p>
                    </div>
                </Link>

                <Link
                    to="/student/notifications"
                    className="p-6 bg-white rounded-xl shadow-soft hover:shadow-lg transition-all flex items-center gap-4"
                >
                    <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                        <Bell className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        <p className="text-sm text-gray-500">{unreadCount} unread messages</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default StudentDashboard;
