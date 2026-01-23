import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import scheduleReducer from './slices/scheduleSlice';
import notificationReducer from './slices/notificationSlice';
import applicationReducer from './slices/applicationSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        schedule: scheduleReducer,
        notification: notificationReducer,
        application: applicationReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
