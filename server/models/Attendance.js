import mongoose from 'mongoose';

const attendanceRecordSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['present', 'absent'],
        required: true
    }
}, { _id: false });

const attendanceSchema = new mongoose.Schema({
    scheduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule',
        required: true
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    department: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    records: [attendanceRecordSchema]
}, {
    timestamps: true
});

// Compound index to ensure unique attendance per schedule per date
attendanceSchema.index({ scheduleId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ department: 1, year: 1, date: 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
