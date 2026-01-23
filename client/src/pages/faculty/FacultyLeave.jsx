import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import {
    Clock,
    Calendar,
    X,
    Save,
    AlertTriangle,
    CheckCircle,
    Users,
} from 'lucide-react';
import toast from 'react-hot-toast';

const FacultyLeave = () => {
    const { user } = useSelector((state) => state.auth);
    const [leaves, setLeaves] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showSubstituteModal, setShowSubstituteModal] = useState(false);
    const [conflicts, setConflicts] = useState([]);
    const [availableFaculty, setAvailableFaculty] = useState([]);
    const [substitutions, setSubstitutions] = useState([]);

    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        reason: '',
    });

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const response = await api.get('/faculty-leave');
            setLeaves(response.data.leaves);
        } catch (error) {
            toast.error('Failed to fetch leaves');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const checkConflicts = async () => {
        try {
            const response = await api.post('/faculty-leave/check', {
                startDate: formData.startDate,
                endDate: formData.endDate,
            });

            if (response.data.hasConflicts) {
                setConflicts(response.data.conflicts);
                // Fetch available substitutes
                const facultyResponse = await api.get('/faculty-leave/substitutes');
                setAvailableFaculty(facultyResponse.data.faculty);
                // Initialize substitutions
                setSubstitutions(response.data.conflicts.map((c) => ({
                    scheduleId: c.scheduleId,
                    subject: c.subject,
                    day: c.day,
                    date: c.date,
                    startTime: c.startTime,
                    endTime: c.endTime,
                    substituteFacultyId: '',
                })));
                setShowModal(false);
                setShowSubstituteModal(true);
            } else {
                // No conflicts, submit directly
                await submitLeave([]);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to check conflicts');
        }
    };

    const handleSubstituteChange = (scheduleId, facultyId) => {
        setSubstitutions((prev) =>
            prev.map((s) =>
                s.scheduleId === scheduleId ? { ...s, substituteFacultyId: facultyId } : s
            )
        );
    };

    const submitLeave = async (subs) => {
        try {
            await api.post('/faculty-leave', {
                startDate: formData.startDate,
                endDate: formData.endDate,
                reason: formData.reason,
                substitutions: subs,
            });
            toast.success('Leave application submitted successfully');
            setShowModal(false);
            setShowSubstituteModal(false);
            setFormData({ startDate: '', endDate: '', reason: '' });
            fetchLeaves();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit leave');
        }
    };

    const handleSubmitWithSubstitutes = () => {
        // Validate all substitutes are selected
        const incomplete = substitutions.some((s) => !s.substituteFacultyId);
        if (incomplete) {
            toast.error('Please assign a substitute for all classes');
            return;
        }
        submitLeave(substitutions);
    };

    const cancelLeave = async (id) => {
        if (window.confirm('Are you sure you want to cancel this leave?')) {
            try {
                await api.delete(`/faculty-leave/${id}`);
                toast.success('Leave cancelled successfully');
                fetchLeaves();
            } catch (error) {
                toast.error('Failed to cancel leave');
            }
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Leave Management</h1>
                    <p className="text-gray-500">Apply for leave and manage substitutes</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-xl font-medium hover:opacity-90 transition-all"
                >
                    <Clock className="w-5 h-5" />
                    Apply for Leave
                </button>
            </div>

            {/* Leave History */}
            <div className="bg-white rounded-xl shadow-soft">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Leave History</h2>
                </div>
                <div className="p-6">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="spinner"></div>
                        </div>
                    ) : leaves.length > 0 ? (
                        <div className="space-y-4">
                            {leaves.map((leave) => (
                                <div
                                    key={leave._id}
                                    className="p-4 rounded-xl border-2 border-gray-100 bg-gray-50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${leave.status === 'approved' ? 'bg-green-100 text-green-600' :
                                                    leave.status === 'rejected' ? 'bg-red-100 text-red-600' :
                                                        'bg-amber-100 text-amber-600'
                                                }`}>
                                                <Calendar className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-gray-500">{leave.reason}</p>
                                                {leave.substitutions?.length > 0 && (
                                                    <p className="text-xs text-primary-600 mt-1">
                                                        {leave.substitutions.length} class(es) with substitutes
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${leave.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    leave.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-amber-100 text-amber-700'
                                                }`}>
                                                {leave.status}
                                            </span>
                                            {leave.status === 'pending' && (
                                                <button
                                                    onClick={() => cancelLeave(leave._id)}
                                                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                                >
                                                    <X className="w-5 h-5 text-red-500" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Leave Records</h3>
                            <p className="text-gray-500">You haven't applied for any leave yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Apply Leave Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 modal-overlay">
                    <div className="bg-white rounded-2xl w-full max-w-md slide-in">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">Apply for Leave</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                    placeholder="Enter reason for leave..."
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={checkConflicts}
                                    disabled={!formData.startDate || !formData.endDate || !formData.reason}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Save className="w-5 h-5" />
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Substitute Assignment Modal */}
            {showSubstituteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 modal-overlay">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col slide-in">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center gap-3 text-amber-600 mb-2">
                                <AlertTriangle className="w-6 h-6" />
                                <h2 className="text-xl font-bold">Schedule Conflict Detected</h2>
                            </div>
                            <p className="text-gray-500">
                                You have {conflicts.length} class(es) scheduled during your leave period.
                                Please assign substitute faculty for each class.
                            </p>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 space-y-4">
                            {substitutions.map((sub, index) => (
                                <div key={sub.scheduleId} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{sub.subject}</h3>
                                            <p className="text-sm text-gray-500">
                                                {sub.day} • {sub.startTime} - {sub.endTime} • {new Date(sub.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Users className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <select
                                        value={sub.substituteFacultyId}
                                        onChange={(e) => handleSubstituteChange(sub.scheduleId, e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="">Select Substitute Faculty</option>
                                        {availableFaculty.map((faculty) => (
                                            <option key={faculty._id} value={faculty._id}>
                                                {faculty.name} - {faculty.department}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={() => setShowSubstituteModal(false)}
                                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitWithSubstitutes}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                Submit with Substitutes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultyLeave;
