import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useSocket from './hooks/useSocket';

// Pages
import Home from './pages/Home';
import FacultyLogin from './pages/auth/FacultyLogin';
import StudentLogin from './pages/auth/StudentLogin';
import FacultyRegister from './pages/auth/FacultyRegister';
import StudentRegister from './pages/auth/StudentRegister';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultySchedule from './pages/faculty/FacultySchedule';
import FacultyLeave from './pages/faculty/FacultyLeave';
import FacultyNotifications from './pages/faculty/FacultyNotifications';
import FacultyProfile from './pages/faculty/FacultyProfile';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentTimetable from './pages/student/StudentTimetable';
import StudentApplications from './pages/student/StudentApplications';
import StudentNotifications from './pages/student/StudentNotifications';
import StudentProfile from './pages/student/StudentProfile';

// Layout
import DashboardLayout from './components/Layout/DashboardLayout';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (allowedRole && user?.role !== allowedRole) {
        return <Navigate to={user?.role === 'faculty' ? '/faculty-dashboard' : '/student-dashboard'} replace />;
    }

    return children;
};

function App() {
    // Initialize socket connection
    useSocket();

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/faculty/login" element={<FacultyLogin />} />
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/faculty/register" element={<FacultyRegister />} />
            <Route path="/student/register" element={<StudentRegister />} />

            {/* Faculty Routes */}
            <Route
                path="/faculty-dashboard"
                element={
                    <ProtectedRoute allowedRole="faculty">
                        <DashboardLayout>
                            <FacultyDashboard />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/faculty/schedule"
                element={
                    <ProtectedRoute allowedRole="faculty">
                        <DashboardLayout>
                            <FacultySchedule />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/faculty/leave"
                element={
                    <ProtectedRoute allowedRole="faculty">
                        <DashboardLayout>
                            <FacultyLeave />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/faculty/notifications"
                element={
                    <ProtectedRoute allowedRole="faculty">
                        <DashboardLayout>
                            <FacultyNotifications />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/faculty/profile"
                element={
                    <ProtectedRoute allowedRole="faculty">
                        <DashboardLayout>
                            <FacultyProfile />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            {/* Student Routes */}
            <Route
                path="/student-dashboard"
                element={
                    <ProtectedRoute allowedRole="student">
                        <DashboardLayout>
                            <StudentDashboard />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student/timetable"
                element={
                    <ProtectedRoute allowedRole="student">
                        <DashboardLayout>
                            <StudentTimetable />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student/applications"
                element={
                    <ProtectedRoute allowedRole="student">
                        <DashboardLayout>
                            <StudentApplications />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student/notifications"
                element={
                    <ProtectedRoute allowedRole="student">
                        <DashboardLayout>
                            <StudentNotifications />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student/profile"
                element={
                    <ProtectedRoute allowedRole="student">
                        <DashboardLayout>
                            <StudentProfile />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
