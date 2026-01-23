import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import {
    LayoutDashboard,
    Calendar,
    Bell,
    User,
    LogOut,
    FileText,
    Clock,
    GraduationCap,
    Users,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Sidebar = ({ isOpen, setIsOpen, role }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        await dispatch(logout());
        toast.success('Logged out successfully');
        navigate('/');
    };

    const facultyLinks = [
        { to: '/faculty-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/faculty/schedule', icon: Calendar, label: 'Schedule' },
        { to: '/faculty/leave', icon: Clock, label: 'Leave Management' },
        { to: '/faculty/notifications', icon: Bell, label: 'Notifications' },
        { to: '/faculty/profile', icon: User, label: 'Profile' },
    ];

    const studentLinks = [
        { to: '/student-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/student/timetable', icon: Calendar, label: 'Timetable' },
        { to: '/student/applications', icon: FileText, label: 'Applications' },
        { to: '/student/notifications', icon: Bell, label: 'Notifications' },
        { to: '/student/profile', icon: User, label: 'Profile' },
    ];

    const links = role === 'faculty' ? facultyLinks : studentLinks;

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-white shadow-xl z-30 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'
                    } ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                {/* Logo Section */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <img
                            src="/logo1.png"
                            alt="CampusSync Logo"
                            className="w-10 h-10 rounded-xl object-contain flex-shrink-0"
                        />
                        {isOpen && (
                            <div className="overflow-hidden">
                                <h1 className="text-lg font-bold text-gray-800">CampusSync</h1>
                                <p className="text-xs text-gray-500 capitalize">{role} Portal</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {isOpen ? (
                            <ChevronLeft className="w-5 h-5 text-gray-500" />
                        ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                    </button>
                </div>

                {/* User Info */}
                {isOpen && (
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-semibold text-gray-800 truncate">{user?.name}</p>
                                <p className="text-sm text-gray-500 truncate">{user?.department}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Links */}
                <nav className="p-4 space-y-2">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`
                            }
                        >
                            <link.icon className="w-5 h-5 flex-shrink-0" />
                            {isOpen && <span className="font-medium">{link.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-4 left-0 right-0 px-4">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all ${!isOpen && 'justify-center'
                            }`}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {isOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
