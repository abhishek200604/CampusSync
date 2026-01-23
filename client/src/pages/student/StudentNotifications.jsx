import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications, markAsRead, markAllAsRead } from '../../store/slices/notificationSlice';
import {
    Bell,
    Calendar,
    FileText,
    CheckCircle,
    XCircle,
    AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

const StudentNotifications = () => {
    const dispatch = useDispatch();
    const { notifications, isLoading } = useSelector((state) => state.notification);

    useEffect(() => {
        dispatch(getNotifications());
    }, [dispatch]);

    const handleMarkAsRead = (id) => {
        dispatch(markAsRead(id));
    };

    const handleMarkAllAsRead = () => {
        dispatch(markAllAsRead());
        toast.success('All notifications marked as read');
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'schedule_update':
                return <Calendar className="w-5 h-5" />;
            case 'application_status':
                return <FileText className="w-5 h-5" />;
            default:
                return <Bell className="w-5 h-5" />;
        }
    };

    const getIconColor = (type, title) => {
        if (title?.toLowerCase().includes('approved')) return 'bg-green-100 text-green-600';
        if (title?.toLowerCase().includes('rejected')) return 'bg-red-100 text-red-600';
        if (type === 'schedule_update') return 'bg-blue-100 text-blue-600';
        return 'bg-purple-100 text-purple-600';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                    <p className="text-gray-500">Stay updated with schedule changes and application status</p>
                </div>
                <button
                    onClick={handleMarkAllAsRead}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                >
                    Mark all as read
                </button>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-xl shadow-soft">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="spinner"></div>
                    </div>
                ) : notifications.length > 0 ? (
                    <div>
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                onClick={() => handleMarkAsRead(notification._id)}
                                className={`p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-purple-50' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getIconColor(notification.type, notification.title)}`}>
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                                            {notification.title?.toLowerCase().includes('approved') && (
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                            )}
                                            {notification.title?.toLowerCase().includes('rejected') && (
                                                <XCircle className="w-4 h-4 text-red-500" />
                                            )}
                                        </div>
                                        <p className="text-gray-600 mt-1">{notification.message}</p>
                                        <p className="text-sm text-gray-400 mt-2">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    {!notification.isRead && (
                                        <div className="w-3 h-3 rounded-full bg-purple-500 flex-shrink-0"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Notifications</h3>
                        <p className="text-gray-500">You're all caught up! Check back later for updates.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentNotifications;
