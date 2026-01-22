import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
};

// Get notifications
export const getNotifications = createAsyncThunk(
    'notification/getNotifications',
    async (unreadOnly = false, { rejectWithValue }) => {
        try {
            const response = await api.get('/notification', {
                params: { unreadOnly: unreadOnly.toString() }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
        }
    }
);

// Get unread count
export const getUnreadCount = createAsyncThunk(
    'notification/getUnreadCount',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/notification/unread/count');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get unread count');
        }
    }
);

// Mark as read
export const markAsRead = createAsyncThunk(
    'notification/markAsRead',
    async (id, { rejectWithValue }) => {
        try {
            await api.put(`/notification/${id}/read`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
        }
    }
);

// Mark all as read
export const markAllAsRead = createAsyncThunk(
    'notification/markAllAsRead',
    async (_, { rejectWithValue }) => {
        try {
            await api.put('/notification/read-all');
            return true;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read');
        }
    }
);

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNotifications.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.notifications = action.payload.notifications;
            })
            .addCase(getNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getUnreadCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload.count;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const notification = state.notifications.find(n => n._id === action.payload);
                if (notification && !notification.isRead) {
                    notification.isRead = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            .addCase(markAllAsRead.fulfilled, (state) => {
                state.notifications.forEach(n => n.isRead = true);
                state.unreadCount = 0;
            });
    },
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
