import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/model/authSlice";
import { authApi } from "@/features/auth/api/authApi";
import { messagesApi } from "@/entities/messages/api/messagesApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, messagesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;