import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true
    },
    day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        required: [true, 'Day is required']
    },
    startTime: {
        type: String,
        required: [true, 'Start time is required']
    },
    endTime: {
        type: String,
        required: [true, 'End time is required']
    },
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true
    },
    year: {
        type: Number,
        required: [true, 'Year is required'],
        min: 1,
        max: 4
    },
    room: {
        type: String,
        trim: true,
        default: 'TBA'
    },
    isRescheduled: {
        type: Boolean,
        default: false
    },
    substituteFacultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    originalFacultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    rescheduledDate: {
        type: Date,
        default: null
    },
    isCancelled: {
        type: Boolean,
        default: false
    },
    cancelReason: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index for efficient querying
scheduleSchema.index({ facultyId: 1, day: 1 });
scheduleSchema.index({ department: 1, year: 1, day: 1 });

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;
