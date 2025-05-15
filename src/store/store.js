import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice'; // <-- Add this import

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});