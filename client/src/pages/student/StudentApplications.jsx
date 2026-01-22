import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getApplications, createApplication } from '../../store/slices/applicationSlice';
import {
    FileText,
    Plus,
    X,
    Save,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';

const StudentApplications = () => {
    const dispatch = useDispatch();
    const { applications, isLoading } = useSelector((state) => state.application);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        type: 'leave',
        subject: '',
        details: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        dispatch(getApplications());
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(createApplication(formData));
        if (createApplication.fulfilled.match(result)) {
            toast.success('Application submitted successfully');
            setShowModal(false);
            setFormData({
                type: 'leave',
                subject: '',
                details: '',
                startDate: '',
                endDate: '',
            });
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'rejected':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-amber-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-700';
            case 'rejected':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-amber-100 text-amber-700';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Applications</h1>
                    <p className="text-gray-500">Submit and track your applications</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-medium hover:opacity-90 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    New Application
                </button>
            </div>

            {/* Quick Application Types */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { type: 'leave', title: 'Leave Application', desc: 'Request time off from classes', color: 'from-blue-500 to-cyan-500' },
                    { type: 'bonafide', title: 'Bonafide Certificate', desc: 'Request official certificate', color: 'from-purple-500 to-pink-500' },
                    { type: 'other', title: 'Other Request', desc: 'General application', color: 'from-orange-500 to-amber-500' },
                ].map((item) => (
                    <button
                        key={item.type}
                        onClick={() => {
                            setFormData((prev) => ({ ...prev, type: item.type }));
                            setShowModal(true);
                        }}
                        className="p-6 bg-white rounded-xl shadow-soft hover:shadow-lg transition-all text-left"
                    >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-4`}>
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-800">{item.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                    </button>
                ))}
            </div>

            {/* Applications List */}
            <div className="bg-white rounded-xl shadow-soft">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Application History</h2>
                </div>
                <div className="p-6">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="spinner"></div>
                        </div>
                    ) : applications.length > 0 ? (
                        <div className="space-y-4">
                            {applications.map((app) => (
                                <div
                                    key={app._id}
                                    className="p-4 rounded-xl bg-gray-50 border border-gray-200"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${app.type === 'leave' ? 'bg-blue-100 text-blue-600' :
                                                    app.type === 'bonafide' ? 'bg-purple-100 text-purple-600' :
                                                        'bg-orange-100 text-orange-600'
                                                }`}>
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-gray-800">{app.subject}</h3>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${app.type === 'leave' ? 'bg-blue-100 text-blue-700' :
                                                            app.type === 'bonafide' ? 'bg-purple-100 text-purple-700' :
                                                                'bg-orange-100 text-orange-700'
                                                        }`}>
                                                        {app.type}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">{app.details}</p>
                                                {app.startDate && (
                                                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(app.startDate).toLocaleDateString()} - {new Date(app.endDate).toLocaleDateString()}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Submitted on {new Date(app.createdAt).toLocaleDateString()}
                                                </p>
                                                {app.reviewRemarks && (
                                                    <p className="text-sm text-gray-600 mt-2 italic">
                                                        Remarks: {app.reviewRemarks}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1 ${getStatusColor(app.status)}`}>
                                                {getStatusIcon(app.status)}
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Applications</h3>
                            <p className="text-gray-500 mb-4">You haven't submitted any applications yet</p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-700 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Submit Application
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* New Application Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 modal-overlay">
                    <div className="bg-white rounded-2xl w-full max-w-lg slide-in">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">New Application</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Application Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="leave">Leave Application</option>
                                    <option value="bonafide">Bonafide Certificate</option>
                                    <option value="other">Other Request</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Brief subject of your application"
                                    required
                                />
                            </div>
                            {formData.type === 'leave' && (
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
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Details</label>
                                <textarea
                                    name="details"
                                    value={formData.details}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                    placeholder="Provide detailed reason for your application..."
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
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save className="w-5 h-5" />
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentApplications;
