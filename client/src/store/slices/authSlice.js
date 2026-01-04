import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Get current user profile from our backend
export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/auth/me');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
});

// Update user profile
export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, { rejectWithValue }) => {
    try {
        const { data } = await api.put('/auth/profile', profileData);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isLoading: false,
        error: null
    },
    reducers: {
        clearError: (state) => { state.error = null; },
        clearUser: (state) => {
            state.user = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMe.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
            })
            .addCase(getMe.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.user = null;
            })
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearUser } = authSlice.actions;
export default authSlice.reducer;
