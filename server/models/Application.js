import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['leave', 'bonafide', 'other'],
        required: [true, 'Application type is required']
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true
    },
    details: {
        type: String,
        required: [true, 'Details are required'],
        trim: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    reviewedAt: {
        type: Date,
        default: null
    },
    reviewRemarks: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index for efficient querying
applicationSchema.index({ studentId: 1, status: 1 });
applicationSchema.index({ status: 1, createdAt: -1 });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
