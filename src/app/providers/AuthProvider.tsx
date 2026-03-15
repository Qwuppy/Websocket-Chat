'use client'

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/shared/lib/hooks/redux";
import { setAuth, logout } from "@/features/auth/model/authSlice";
import { supabase } from "@/shared/lib/server/supabaseClient";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user?.email && session.access_token) {
                dispatch(setAuth({
                    token: session.access_token,
                    userName: session.user.email,
                }));
            } else {
                dispatch(logout());
                router.replace('/auth');
            }
        });

        // Отписываемся при размонтировании
        return () => listener.subscription.unsubscribe();
    }, [dispatch, router]);

    return <>{children}</>;
};