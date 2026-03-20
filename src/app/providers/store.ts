import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/model/authSlice";
import chatReducer from "@/entities/chat/model/chatSlice";
import { authApi } from "@/features/auth/api/authApi";
import { messagesApi } from "@/entities/messages/api/messagesApi";
import { chatApi } from "@/entities/chat/api/chatApi"; 


export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    [authApi.reducerPath]: authApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      messagesApi.middleware,
      chatApi.middleware, 
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;