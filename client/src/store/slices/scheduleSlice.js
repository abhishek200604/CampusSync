import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
    schedules: [],
    timetable: null,
    currentSchedule: null,
    isLoading: false,
    error: null,
};

// Get schedules
export const getSchedules = createAsyncThunk(
    'schedule/getSchedules',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/schedule', { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch schedules');
        }
    }
);

// Get student timetable
export const getTimetable = createAsyncThunk(
    'schedule/getTimetable',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/schedule/timetable');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch timetable');
        }
    }
);

// Create schedule
export const createSchedule = createAsyncThunk(
    'schedule/createSchedule',
    async (scheduleData, { rejectWithValue }) => {
        try {
            const response = await api.post('/schedule', scheduleData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create schedule');
        }
    }
);

// Update schedule
export const updateSchedule = createAsyncThunk(
    'schedule/updateSchedule',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/schedule/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update schedule');
        }
    }
);

// Delete schedule
export const deleteSchedule = createAsyncThunk(
    'schedule/deleteSchedule',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/schedule/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete schedule');
        }
    }
);

// Cancel schedule
export const cancelSchedule = createAsyncThunk(
    'schedule/cancelSchedule',
    async ({ id, reason }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/schedule/${id}/cancel`, { reason });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to cancel schedule');
        }
    }
);

// Assign substitute
export const assignSubstitute = createAsyncThunk(
    'schedule/assignSubstitute',
    async ({ id, substituteFacultyId }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/schedule/${id}/substitute`, { substituteFacultyId });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to assign substitute');
        }
    }
);

const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        updateScheduleRealtime: (state, action) => {
            const { type, schedule, scheduleId } = action.payload;

            if (type === 'created') {
                state.schedules.push(schedule);
            } else if (type === 'updated' || type === 'cancelled' || type === 'substitute_assigned') {
                const index = state.schedules.findIndex(s => s._id === schedule._id);
                if (index !== -1) {
                    state.schedules[index] = schedule;
                }
                // Update timetable if exists
                if (state.timetable && state.timetable[schedule.day]) {
                    const tIndex = state.timetable[schedule.day].findIndex(s => s._id === schedule._id);
                    if (tIndex !== -1) {
                        state.timetable[schedule.day][tIndex] = schedule;
                    }
                }
            } else if (type === 'deleted') {
                state.schedules = state.schedules.filter(s => s._id !== scheduleId);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Get schedules
            .addCase(getSchedules.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSchedules.fulfilled, (state, action) => {
                state.isLoading = false;
                state.schedules = action.payload.schedules;
            })
            .addCase(getSchedules.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Get timetable
            .addCase(getTimetable.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTimetable.fulfilled, (state, action) => {
                state.isLoading = false;
                state.timetable = action.payload.timetable;
            })
            .addCase(getTimetable.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Create schedule
            .addCase(createSchedule.fulfilled, (state, action) => {
                state.schedules.push(action.payload.schedule);
            })
            // Update schedule
            .addCase(updateSchedule.fulfilled, (state, action) => {
                const index = state.schedules.findIndex(s => s._id === action.payload.schedule._id);
                if (index !== -1) {
                    state.schedules[index] = action.payload.schedule;
                }
            })
            // Delete schedule
            .addCase(deleteSchedule.fulfilled, (state, action) => {
                state.schedules = state.schedules.filter(s => s._id !== action.payload);
            })
            // Cancel schedule
            .addCase(cancelSchedule.fulfilled, (state, action) => {
                const index = state.schedules.findIndex(s => s._id === action.payload.schedule._id);
                if (index !== -1) {
                    state.schedules[index] = action.payload.schedule;
                }
            });
    },
});

export const { clearError, updateScheduleRealtime } = scheduleSlice.actions;
export default scheduleSlice.reducer;
