import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
    applications: [],
    pendingCount: 0,
    isLoading: false,
    error: null,
};

// Get applications
export const getApplications = createAsyncThunk(
    'application/getApplications',
    async (params, { rejectWithValue }) => {
        try {
            const response = await api.get('/application', { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
        }
    }
);

// Create application
export const createApplication = createAsyncThunk(
    'application/createApplication',
    async (applicationData, { rejectWithValue }) => {
        try {
            const response = await api.post('/application', applicationData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to submit application');
        }
    }
);

// Review application
export const reviewApplication = createAsyncThunk(
    'application/reviewApplication',
    async ({ id, status, remarks }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/application/${id}/review`, { status, remarks });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to review application');
        }
    }
);

// Get pending count
export const getPendingCount = createAsyncThunk(
    'application/getPendingCount',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/application/pending/count');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get pending count');
        }
    }
);

const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getApplications.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getApplications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.applications = action.payload.applications;
            })
            .addCase(getApplications.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(createApplication.fulfilled, (state, action) => {
                state.applications.unshift(action.payload.application);
            })
            .addCase(reviewApplication.fulfilled, (state, action) => {
                const index = state.applications.findIndex(a => a._id === action.payload.application._id);
                if (index !== -1) {
                    state.applications[index] = action.payload.application;
                }
                state.pendingCount = Math.max(0, state.pendingCount - 1);
            })
            .addCase(getPendingCount.fulfilled, (state, action) => {
                state.pendingCount = action.payload.count;
            });
    },
});

export const { clearError } = applicationSlice.actions;
export default applicationSlice.reducer;
