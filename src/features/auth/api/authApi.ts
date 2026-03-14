import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '@/shared/lib/server/supabaseClient';
import { AuthResponse } from '../model/types';

// Типы запросов
interface RequestToLogin { email: string; password: string; }
interface RequestToRegister { email: string; password: string; }

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, RequestToLogin>({
            async queryFn({ email, password }) {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) return { error: { status: 'CUSTOM_ERROR', data: error.message } };
                return { data: { access_token: data.session?.access_token || '', user: data.user } as AuthResponse };
            }
        }),
        register: builder.mutation<AuthResponse, RequestToRegister>({
            async queryFn({ email, password }) {
                const { data, error } = await supabase.auth.signUp({ email, password });
                if (error) return { error: { status: 'CUSTOM_ERROR', data: error.message } };
                return { data: { access_token: data.session?.access_token || '', user: data.user } as AuthResponse };
            }
        }),
        logout: builder.mutation<void, void>({
            async queryFn() {
                const { error } = await supabase.auth.signOut();
                if (error) return { error: { status: 'CUSTOM_ERROR', data: error.message } };
                return { data: undefined };
            }
        }),
    })
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApi;
