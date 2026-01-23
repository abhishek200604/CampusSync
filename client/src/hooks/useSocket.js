import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { updateScheduleRealtime } from '../store/slices/scheduleSlice';
import { addNotification } from '../store/slices/notificationSlice';
import toast from 'react-hot-toast';

// Use environment variable for production, fallback to localhost for dev
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useSocket = () => {
    const socketRef = useRef(null);
    const dispatch = useDispatch();
    const { token, user } = useSelector((state) => state.auth);

    const connect = useCallback(() => {
        if (!token || socketRef.current?.connected) return;

        socketRef.current = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket', 'polling'],
        });

        socketRef.current.on('connect', () => {
            console.log('Socket connected');
        });

        socketRef.current.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        // Listen for schedule updates
        socketRef.current.on('schedule_update', (data) => {
            dispatch(updateScheduleRealtime(data));

            // Show toast notification
            if (data.type === 'updated') {
                toast.success('Schedule has been updated!', {
                    icon: '📅',
                });
            } else if (data.type === 'cancelled') {
                toast.error('A class has been cancelled', {
                    icon: '❌',
                });
            } else if (data.type === 'substitute_assigned') {
                toast.success('A substitute has been assigned', {
                    icon: '👨‍🏫',
                });
            }
        });

        // Listen for notifications
        socketRef.current.on('notification_received', (data) => {
            dispatch(addNotification({
                ...data,
                _id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                isRead: false,
            }));

            toast(data.message, {
                icon: '🔔',
                duration: 5000,
            });
        });

        socketRef.current.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

    }, [token, dispatch]);

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
    }, []);

    const joinRoom = useCallback((room) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('join_room', room);
        }
    }, []);

    const leaveRoom = useCallback((room) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('leave_room', room);
        }
    }, []);

    useEffect(() => {
        if (token && user) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [token, user, connect, disconnect]);

    return {
        socket: socketRef.current,
        connect,
        disconnect,
        joinRoom,
        leaveRoom,
    };
};

export default useSocket;
