import { User } from "@/entities/user/model/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from '../api/authApi'

interface AuthState {
    user: User | null
    token: string | null
}

const initialState: AuthState = {
    user: null,
    token: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<{ token: string; user: User }>) => {
            state.token = action.payload.token
            state.user = action.payload.user
        },
        logout: (state) => {
            state.token = null
            state.user = null
        },
    },
})

export const { setAuth, logout } = authSlice.actions
export default authSlice.reducer