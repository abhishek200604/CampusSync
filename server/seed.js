import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Models
import User from './models/User.js';
import Schedule from './models/Schedule.js';
import Application from './models/Application.js';
import Notification from './models/Notification.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campussync';

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Schedule.deleteMany({});
        await Application.deleteMany({});
        await Notification.deleteMany({});
        console.log('Cleared existing data');

        // Create Faculty Members
        const facultyData = [
            {
                name: 'Dr. Rajesh Kumar',
                email: 'rajesh@campus.edu',
                password: 'password123',
                role: 'faculty',
                department: 'Computer Science',
                designation: 'Professor',
            },
            {
                name: 'Dr. Priya Sharma',
                email: 'priya@campus.edu',
                password: 'password123',
                role: 'faculty',
                department: 'Computer Science',
                designation: 'Associate Professor',
            },
            {
                name: 'Dr. Amit Patel',
                email: 'amit@campus.edu',
                password: 'password123',
                role: 'faculty',
                department: 'Information Technology',
                designation: 'Assistant Professor',
            },
            {
                name: 'Dr. Sneha Reddy',
                email: 'sneha@campus.edu',
                password: 'password123',
                role: 'faculty',
                department: 'Electronics',
                designation: 'Professor',
            },
        ];

        const faculty = await User.create(facultyData);
        console.log(`Created ${faculty.length} faculty members`);

        // Create Students
        const studentData = [
            {
                name: 'Rahul Verma',
                email: 'rahul@campus.edu',
                password: 'password123',
                role: 'student',
                department: 'Computer Science',
                rollNumber: 'CS2023001',
                year: 2,
            },
            {
                name: 'Ananya Singh',
                email: 'ananya@campus.edu',
                password: 'password123',
                role: 'student',
                department: 'Computer Science',
                rollNumber: 'CS2023002',
                year: 2,
            },
            {
                name: 'Vikram Joshi',
                email: 'vikram@campus.edu',
                password: 'password123',
                role: 'student',
                department: 'Computer Science',
                rollNumber: 'CS2023003',
                year: 2,
            },
            {
                name: 'Meera Nair',
                email: 'meera@campus.edu',
                password: 'password123',
                role: 'student',
                department: 'Computer Science',
                rollNumber: 'CS2023004',
                year: 2,
            },
            {
                name: 'Arjun Menon',
                email: 'arjun@campus.edu',
                password: 'password123',
                role: 'student',
                department: 'Computer Science',
                rollNumber: 'CS2023005',
                year: 2,
            },
            {
                name: 'Pooja Gupta',
                email: 'pooja@campus.edu',
                password: 'password123',
                role: 'student',
                department: 'Information Technology',
                rollNumber: 'IT2023001',
                year: 3,
            },
        ];

        const students = await User.create(studentData);
        console.log(`Created ${students.length} students`);

        // Create Schedules for Dr. Rajesh Kumar
        const scheduleData = [
            {
                subject: 'Data Structures',
                day: 'Monday',
                startTime: '09:00',
                endTime: '10:00',
                facultyId: faculty[0]._id,
                department: 'Computer Science',
                year: 2,
                room: 'CS-101',
            },
            {
                subject: 'Data Structures',
                day: 'Wednesday',
                startTime: '09:00',
                endTime: '10:00',
                facultyId: faculty[0]._id,
                department: 'Computer Science',
                year: 2,
                room: 'CS-101',
            },
            {
                subject: 'Data Structures Lab',
                day: 'Friday',
                startTime: '14:00',
                endTime: '16:00',
                facultyId: faculty[0]._id,
                department: 'Computer Science',
                year: 2,
                room: 'CS-Lab-1',
            },
            {
                subject: 'Algorithms',
                day: 'Tuesday',
                startTime: '10:00',
                endTime: '11:00',
                facultyId: faculty[0]._id,
                department: 'Computer Science',
                year: 2,
                room: 'CS-102',
            },
            {
                subject: 'Algorithms',
                day: 'Thursday',
                startTime: '10:00',
                endTime: '11:00',
                facultyId: faculty[0]._id,
                department: 'Computer Science',
                year: 2,
                room: 'CS-102',
            },
            // Schedules for Dr. Priya Sharma
            {
                subject: 'Database Management',
                day: 'Monday',
                startTime: '11:00',
                endTime: '12:00',
                facultyId: faculty[1]._id,
                department: 'Computer Science',
                year: 2,
                room: 'CS-103',
            },
            {
                subject: 'Database Management',
                day: 'Thursday',
                startTime: '11:00',
                endTime: '12:00',
                facultyId: faculty[1]._id,
                department: 'Computer Science',
                year: 2,
                room: 'CS-103',
            },
            {
                subject: 'Web Development',
                day: 'Tuesday',
                startTime: '14:00',
                endTime: '15:00',
                facultyId: faculty[1]._id,
                department: 'Computer Science',
                year: 2,
                room: 'CS-104',
            },
            // Schedules for Dr. Amit Patel
            {
                subject: 'Cloud Computing',
                day: 'Monday',
                startTime: '10:00',
                endTime: '11:00',
                facultyId: faculty[2]._id,
                department: 'Information Technology',
                year: 3,
                room: 'IT-201',
            },
            {
                subject: 'Cyber Security',
                day: 'Wednesday',
                startTime: '11:00',
                endTime: '12:00',
                facultyId: faculty[2]._id,
                department: 'Information Technology',
                year: 3,
                room: 'IT-202',
            },
        ];

        const schedules = await Schedule.create(scheduleData);
        console.log(`Created ${schedules.length} schedules`);

        // Create some Applications
        const applicationData = [
            {
                type: 'leave',
                studentId: students[0]._id,
                subject: 'Medical Leave Request',
                details: 'I am suffering from fever and need rest for 2 days. Doctor has advised complete bed rest.',
                startDate: new Date('2026-01-25'),
                endDate: new Date('2026-01-26'),
                status: 'pending',
            },
            {
                type: 'bonafide',
                studentId: students[1]._id,
                subject: 'Bonafide Certificate for Bank Account',
                details: 'I need a bonafide certificate for opening a bank account as per bank requirements.',
                status: 'approved',
                reviewedBy: faculty[0]._id,
                reviewedAt: new Date(),
                reviewRemarks: 'Approved. Please collect from office.',
            },
            {
                type: 'leave',
                studentId: students[2]._id,
                subject: 'Family Function Leave',
                details: 'Need to attend a family wedding in my hometown. Request for leave.',
                startDate: new Date('2026-01-28'),
                endDate: new Date('2026-01-30'),
                status: 'pending',
            },
            {
                type: 'other',
                studentId: students[3]._id,
                subject: 'Letter of Recommendation Request',
                details: 'Requesting a letter of recommendation for internship application at Google.',
                status: 'rejected',
                reviewedBy: faculty[1]._id,
                reviewedAt: new Date(),
                reviewRemarks: 'Please meet me in person to discuss your internship goals.',
            },
        ];

        const applications = await Application.create(applicationData);
        console.log(`Created ${applications.length} applications`);

        // Create some Notifications
        const notificationData = [
            {
                recipientId: students[0]._id,
                senderId: faculty[0]._id,
                type: 'schedule_update',
                title: 'Schedule Updated',
                message: 'Data Structures class on Monday has been moved to Room CS-105.',
                isRead: false,
            },
            {
                recipientId: students[1]._id,
                senderId: faculty[0]._id,
                type: 'application_status',
                title: 'Application Approved',
                message: 'Your bonafide certificate request has been approved. Please collect from office.',
                isRead: true,
            },
            {
                recipientId: faculty[0]._id,
                senderId: students[0]._id,
                type: 'leave_request',
                title: 'New Leave Application',
                message: 'Rahul Verma has submitted a medical leave application.',
                isRead: false,
            },
            {
                recipientId: faculty[0]._id,
                senderId: students[2]._id,
                type: 'leave_request',
                title: 'New Leave Application',
                message: 'Vikram Joshi has submitted a leave application for family function.',
                isRead: false,
            },
        ];

        const notifications = await Notification.create(notificationData);
        console.log(`Created ${notifications.length} notifications`);

        console.log('\n✅ Demo data seeded successfully!\n');
        console.log('📧 Demo Login Credentials:');
        console.log('─'.repeat(40));
        console.log('FACULTY:');
        console.log('  Email: rajesh@campus.edu');
        console.log('  Password: password123');
        console.log('');
        console.log('STUDENT:');
        console.log('  Email: rahul@campus.edu');
        console.log('  Password: password123');
        console.log('─'.repeat(40));

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
