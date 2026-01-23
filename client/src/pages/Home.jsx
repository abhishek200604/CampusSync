import { Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GraduationCap, Users, ArrowRight, BookOpen, Bell, Calendar, Clock } from 'lucide-react';

const Home = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    // Redirect if already logged in
    if (isAuthenticated && user) {
        return <Navigate to={user.role === 'faculty' ? '/faculty-dashboard' : '/student-dashboard'} replace />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <header className="px-6 py-4">
                    <nav className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src="/logo1.png"
                                alt="CampusSync Logo"
                                className="w-12 h-12 rounded-xl object-contain"
                            />
                            <div>
                                <h1 className="text-2xl font-bold text-white">CampusSync</h1>
                                <p className="text-xs text-gray-400">College ERP System</p>
                            </div>
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="max-w-7xl mx-auto px-6 py-20">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
                            Welcome to{' '}
                            <span className="gradient-text">CampusSync</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            A modern, real-time college management system designed for seamless
                            communication between faculty and students.
                        </p>
                    </div>

                    {/* Features Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
                        {[
                            { icon: Calendar, title: 'Live Schedules', desc: 'Real-time updates' },
                            { icon: Bell, title: 'Instant Alerts', desc: 'Never miss a thing' },
                            { icon: BookOpen, title: 'Attendance', desc: 'Track with ease' },
                            { icon: Clock, title: 'Leave Management', desc: 'Simplified process' },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="glass rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300"
                            >
                                <feature.icon className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
                                <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                                <p className="text-gray-400 text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Login Cards */}
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Faculty Card */}
                        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 p-8 card-hover">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Faculty Portal</h3>
                                <p className="text-blue-100 mb-6">
                                    Manage schedules, mark attendance, review applications, and stay connected with students.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link
                                        to="/faculty/login"
                                        className="flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
                                    >
                                        Login <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        to="/faculty/register"
                                        className="flex items-center justify-center gap-2 bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors"
                                    >
                                        Register
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Student Card */}
                        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-8 card-hover">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                                    <GraduationCap className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Student Portal</h3>
                                <p className="text-purple-100 mb-6">
                                    View timetables, apply for leave, track applications, and receive instant updates.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link
                                        to="/student/login"
                                        className="flex items-center justify-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
                                    >
                                        Login <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        to="/student/register"
                                        className="flex items-center justify-center gap-2 bg-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors"
                                    >
                                        Register
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="text-center py-8 border-t border-white/10">
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-gray-400 text-sm">© 2026 CampusSync. All rights reserved.</p>
                        <p className="text-gray-500 text-xs">
                            designed and developed by{' '}
                            <Link to="/about" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors uppercase">
                                TEAM
                            </Link>
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Home;
