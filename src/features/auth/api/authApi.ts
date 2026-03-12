import { User } from '@/entities/user/model/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Типы запросов
interface AuthResponse { token: string; user: User }
interface RequestToServer { companyName: string; userName: string; email: string; password: string; }

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://cafe-admin-api-production.up.railway.app/auth' }),
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, RequestToServer>({
            query: (body) => ({ url: '/sign-in', method: 'POST', body }),
        }),
        register: builder.mutation<AuthResponse, RequestToServer>({
            query: (body) => ({ url: '/sign-up', method: 'POST', body }),
        }),
        refreshToken: builder.mutation<AuthResponse, void>({
            query: () => ({ url: '/refresh', method: 'GET' }),
        }),
    }),
})

export const { useLoginMutation, useRegisterMutation, useRefreshTokenMutation } = authApi