import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUnreadCount, markAsRead } from '../../store/slices/notificationSlice';
import { Menu, Bell, Search, X } from 'lucide-react';

const Topbar = ({ toggleSidebar }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { notifications, unreadCount } = useSelector((state) => state.notification);

    useEffect(() => {
        dispatch(getUnreadCount());
    }, [dispatch]);

    const recentNotifications = notifications.slice(0, 5);

    const handleNotificationClick = (notificationId) => {
        dispatch(markAsRead(notificationId));
    };

    return (
        <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white border-b border-gray-100 z-10 transition-all duration-300">
            <div className="h-full px-4 flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Menu className="w-6 h-6 text-gray-600" />
                    </button>

                    <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 w-80">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent border-none outline-none text-gray-700 w-full"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <Bell className="w-6 h-6 text-gray-600" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center notification-badge">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowNotifications(false)}
                                />
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-20 slide-in">
                                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                                        <button
                                            onClick={() => setShowNotifications(false)}
                                            className="p-1 rounded-lg hover:bg-gray-100"
                                        >
                                            <X className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {recentNotifications.length > 0 ? (
                                            recentNotifications.map((notification) => (
                                                <div
                                                    key={notification._id}
                                                    onClick={() => handleNotificationClick(notification._id)}
                                                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-primary-50' : ''
                                                        }`}
                                                >
                                                    <p className="font-medium text-gray-800 text-sm">
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-gray-400 text-xs mt-2">
                                                        {new Date(notification.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center text-gray-500">
                                                No notifications yet
                                            </div>
                                        )}
                                    </div>
                                    <Link
                                        to={user?.role === 'faculty' ? '/faculty/notifications' : '/student/notifications'}
                                        onClick={() => setShowNotifications(false)}
                                        className="block p-3 text-center text-primary-600 font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        View All Notifications
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>

                    {/* User Avatar */}
                    <Link
                        to={user?.role === 'faculty' ? '/faculty/profile' : '/student/profile'}
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
