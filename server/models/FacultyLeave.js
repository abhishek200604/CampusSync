import mongoose from 'mongoose';

const facultyLeaveSchema = new mongoose.Schema({
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    reason: {
        type: String,
        required: [true, 'Reason is required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    substitutions: [{
        scheduleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Schedule'
        },
        substituteFacultyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        day: String,
        date: Date,
        confirmed: {
            type: Boolean,
            default: false
        }
    }],
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewedAt: Date,
    reviewRemarks: String
}, {
    timestamps: true
});

// Index for efficient querying
facultyLeaveSchema.index({ facultyId: 1, startDate: 1, endDate: 1 });
facultyLeaveSchema.index({ status: 1 });

const FacultyLeave = mongoose.model('FacultyLeave', facultyLeaveSchema);

export default FacultyLeave;
