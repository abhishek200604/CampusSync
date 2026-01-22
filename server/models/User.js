import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['student', 'faculty'],
        required: true
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true
    },
    // Student specific fields
    rollNumber: {
        type: String,
        sparse: true,
        trim: true
    },
    year: {
        type: Number,
        min: 1,
        max: 4
    },
    // Faculty specific fields
    designation: {
        type: String,
        trim: true
    },
    profileImage: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Validate student fields
userSchema.pre('save', function (next) {
    if (this.role === 'student') {
        if (!this.rollNumber) {
            return next(new Error('Roll number is required for students'));
        }
        if (!this.year) {
            return next(new Error('Year is required for students'));
        }
    }
    if (this.role === 'faculty') {
        if (!this.designation) {
            return next(new Error('Designation is required for faculty'));
        }
    }
    next();
});

const User = mongoose.model('User', userSchema);

export default User;
