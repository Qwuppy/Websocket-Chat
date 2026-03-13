import { baseQueryWithReauth } from '@/shared/api/baseQueryWithReauth';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AuthResponse } from '../model/types';

// Типы запросов
interface RequestToLogin { email: string; password: string; }
interface RequestToRegister { companyName: string; userName: string; email: string; password: string; }

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, RequestToLogin>({
            query: (body) => ({ url: '/sign-in', method: 'POST', body }),
        }),
        register: builder.mutation<AuthResponse, RequestToRegister>({
            query: (body) => ({ url: '/sign-up', method: 'POST', body }),
        }),
        refreshToken: builder.mutation<AuthResponse, void>({
            query: () => ({ url: '/refresh', method: 'GET' }),
        }),
    }),
})

export const { useLoginMutation, useRegisterMutation, useRefreshTokenMutation } = authApi