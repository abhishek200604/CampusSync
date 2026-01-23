import { useSelector } from 'react-redux';
import { User, Mail, Building, Hash, Calendar } from 'lucide-react';

const StudentProfile = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
                <p className="text-gray-500">{user?.department} - Year {user?.year}</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-soft">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Profile Information</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4" />
                            Full Name
                        </label>
                        <p className="text-gray-800 py-3 px-4 bg-gray-50 rounded-xl">{user?.name}</p>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Mail className="w-4 h-4" />
                            Email Address
                        </label>
                        <p className="text-gray-800 py-3 px-4 bg-gray-50 rounded-xl">{user?.email}</p>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Hash className="w-4 h-4" />
                            Roll Number
                        </label>
                        <p className="text-gray-800 py-3 px-4 bg-gray-50 rounded-xl">{user?.rollNumber}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Building className="w-4 h-4" />
                                Department
                            </label>
                            <p className="text-gray-800 py-3 px-4 bg-gray-50 rounded-xl">{user?.department}</p>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4" />
                                Year
                            </label>
                            <p className="text-gray-800 py-3 px-4 bg-gray-50 rounded-xl">Year {user?.year}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-xl shadow-soft">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Account Information</h2>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="font-medium text-gray-800">Account Status</p>
                            <p className="text-sm text-gray-500">Your account is active</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            Active
                        </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-t border-gray-100">
                        <div>
                            <p className="font-medium text-gray-800">Member Since</p>
                            <p className="text-sm text-gray-500">Account created date</p>
                        </div>
                        <span className="text-gray-600">
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
