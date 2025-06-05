// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserInfo } from '../api'; // 너가 만든 API 함수 재사용

export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem('token');
        const memberId = localStorage.getItem('memberId');

        if (!token || !memberId) {
            return rejectWithValue('Missing token or memberId');
        }

        try {
            const response = await getUserInfo(memberId, token);
            const user = response?.data?.data || response?.data || response;

            if (user) {
                return { token, memberId };
            } else {
                return rejectWithValue('Invalid token');
            }
        } catch (err) {
            return rejectWithValue('Token check failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token') || null,
        memberId: localStorage.getItem('memberId') || null,
        isLoggedIn: !!localStorage.getItem('token'),
        isInitialized: false,
    },
    reducers: {
        login(state, action) {
            const { token, memberId } = action.payload;
            state.token = token;
            state.memberId = memberId;
            state.isLoggedIn = true;
            localStorage.setItem('token', token);
            localStorage.setItem('memberId', memberId);
        },
        logout(state) {
            state.token = null;
            state.memberId = null;
            state.isLoggedIn = false;
            localStorage.removeItem('token');
            localStorage.removeItem('memberId');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.memberId = action.payload.memberId;
                state.isLoggedIn = true;
                state.isInitialized = true;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.token = null;
                state.memberId = null;
                state.isLoggedIn = false;
                state.isInitialized = true;
            });
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
