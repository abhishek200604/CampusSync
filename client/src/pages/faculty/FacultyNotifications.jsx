import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getApplications, reviewApplication } from '../../store/slices/applicationSlice';
import { getNotifications, markAsRead, markAllAsRead } from '../../store/slices/notificationSlice';
import {
    Bell,
    CheckCircle,
    XCircle,
    Clock,
    Check,
    X,
    FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';

const FacultyNotifications = () => {
    const dispatch = useDispatch();
    const { applications, isLoading: appsLoading } = useSelector((state) => state.application);
    const { notifications, isLoading: notifsLoading } = useSelector((state) => state.notification);

    useEffect(() => {
        dispatch(getApplications({ status: 'pending' }));
        dispatch(getNotifications());
    }, [dispatch]);

    const pendingApplications = applications.filter((a) => a.status === 'pending');

    const handleReview = async (applicationId, status) => {
        const result = await dispatch(reviewApplication({ id: applicationId, status }));
        if (reviewApplication.fulfilled.match(result)) {
            toast.success(`Application ${status} successfully`);
        }
    };

    const handleMarkAsRead = (id) => {
        dispatch(markAsRead(id));
    };

    const handleMarkAllAsRead = () => {
        dispatch(markAllAsRead());
        toast.success('All notifications marked as read');
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Notifications & Applications</h1>
                <p className="text-gray-500">Review student applications and view notifications</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Applications */}
                <div className="bg-white rounded-xl shadow-soft">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">Pending Applications</h2>
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                                {pendingApplications.length} pending
                            </span>
                        </div>
                    </div>
                    <div className="p-6">
                        {appsLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="spinner"></div>
                            </div>
                        ) : pendingApplications.length > 0 ? (
                            <div className="space-y-4">
                                {pendingApplications.map((app) => (
                                    <div
                                        key={app._id}
                                        className="p-4 rounded-xl bg-gray-50 border border-gray-200"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                                                    {app.studentId?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{app.studentId?.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {app.studentId?.rollNumber} • {app.studentId?.department}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                                                {app.type}
                                            </span>
                                        </div>
                                        <div className="mb-3">
                                            <p className="font-medium text-gray-800">{app.subject}</p>
                                            <p className="text-sm text-gray-600 mt-1">{app.details}</p>
                                            {app.startDate && (
                                                <p className="text-xs text-gray-500 mt-2">
                                                    <Clock className="w-3 h-3 inline mr-1" />
                                                    {new Date(app.startDate).toLocaleDateString()} - {new Date(app.endDate).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleReview(app._id, 'approved')}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors"
                                            >
                                                <Check className="w-4 h-4" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReview(app._id, 'rejected')}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                <h3 className="font-semibold text-gray-800">All Caught Up!</h3>
                                <p className="text-sm text-gray-500">No pending applications to review</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-xl shadow-soft">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Mark all as read
                            </button>
                        </div>
                    </div>
                    <div className="max-h-[500px] overflow-y-auto">
                        {notifsLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="spinner"></div>
                            </div>
                        ) : notifications.length > 0 ? (
                            <div>
                                {notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        onClick={() => handleMarkAsRead(notification._id)}
                                        className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-primary-50' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.type === 'leave_request' ? 'bg-amber-100 text-amber-600' :
                                                    notification.type === 'substitute_request' ? 'bg-purple-100 text-purple-600' :
                                                        'bg-blue-100 text-blue-600'
                                                }`}>
                                                {notification.type === 'leave_request' ? <FileText className="w-5 h-5" /> :
                                                    notification.type === 'substitute_request' ? <Clock className="w-5 h-5" /> :
                                                        <Bell className="w-5 h-5" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">{notification.title}</p>
                                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                                <p className="text-xs text-gray-400 mt-2">
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            {!notification.isRead && (
                                                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <h3 className="font-semibold text-gray-800">No Notifications</h3>
                                <p className="text-sm text-gray-500">You're all caught up!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyNotifications;
