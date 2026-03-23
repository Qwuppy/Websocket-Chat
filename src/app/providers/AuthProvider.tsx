'use client'

import { useEffect, ReactNode, useState } from "react";
import { useAppDispatch } from "@/shared/lib/hooks/redux";
import { setAuth, logout } from "@/features/auth/model/authSlice";
import { supabase } from "@/shared/lib/server/supabaseClient";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user?.email && session.access_token) {
                dispatch(setAuth({
                    token: session.access_token,
                    userName: session.user.email,
                }));
            } else {
                dispatch(logout());
            }
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user?.email && session.access_token) {
                dispatch(setAuth({
                    token: session.access_token,
                    userName: session.user.email,
                }));
            } else {
                dispatch(logout());
            }
        });

        return () => listener.subscription.unsubscribe();
    }, [dispatch]);

    return <>{children}</>;
};