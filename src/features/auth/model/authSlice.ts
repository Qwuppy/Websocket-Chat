import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { tokenStorage } from "@/shared/lib/auth/tokenStorage";

interface AuthState {
    userName: string | null
    token: string | null
}

const initialState: AuthState = {
    userName: null,
    token: tokenStorage.getActiveToken(),
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<{ token: string; userName: string }>) => {
            state.token = action.payload.token
            state.userName = action.payload.userName
        },
        logout: (state) => {
            state.token = null
            state.userName = null
        },
    },
})

export const { setAuth, logout } = authSlice.actions
export default authSlice.reducer