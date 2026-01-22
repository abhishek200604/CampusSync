import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const initializeSocket = (io) => {
    // Authentication middleware for socket connections
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.headers.cookie?.split('token=')[1]?.split(';')[0];

            if (!token) {
                return next(new Error('Authentication required'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (!user) {
                return next(new Error('User not found'));
            }

            socket.user = user;
            next();
        } catch (error) {
            next(new Error('Authentication failed'));
        }
    });

    io.on('connection', (socket) => {
        const user = socket.user;
        console.log(`User connected: ${user.name} (${user.role})`);

        // Join personal room for direct notifications
        socket.join(user._id.toString());

        // Join department-year room for students (for schedule updates)
        if (user.role === 'student') {
            const room = `${user.department}-${user.year}`;
            socket.join(room);
            console.log(`Student ${user.name} joined room: ${room}`);
        }

        // Join department room for faculty
        if (user.role === 'faculty') {
            socket.join(`faculty-${user.department}`);
            console.log(`Faculty ${user.name} joined room: faculty-${user.department}`);
        }

        // Handle custom events
        socket.on('join_room', (room) => {
            socket.join(room);
            console.log(`${user.name} joined room: ${room}`);
        });

        socket.on('leave_room', (room) => {
            socket.leave(room);
            console.log(`${user.name} left room: ${room}`);
        });

        // Typing indicators for real-time features
        socket.on('typing', ({ room, isTyping }) => {
            socket.to(room).emit('user_typing', {
                userId: user._id,
                userName: user.name,
                isTyping
            });
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${user.name}`);
        });
    });

    return io;
};

// Helper to emit events from controllers
export const emitToRoom = (io, room, event, data) => {
    io.to(room).emit(event, data);
};

export const emitToUser = (io, userId, event, data) => {
    io.to(userId.toString()).emit(event, data);
};
