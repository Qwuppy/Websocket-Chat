'use client'
import { useAppDispatch } from "@/shared/lib/hooks/redux";
import { setAuth, logout } from "@/features/auth/model/authSlice";
import { supabase } from "@/shared/lib/server/supabaseClient";
import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";


interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {

    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        // 🔹 Проверяем текущую сессию при старте приложения
        supabase.auth.getSession().then(({ data }) => {
            if (data.session?.user?.email && data.session.access_token) {
                dispatch(setAuth({
                    token: data.session.access_token,
                    userName: data.session.user.email
                }));
            } else {
                dispatch(logout());
                router.replace('/auth');
            }
        });

        // 🔹 Подписка на события логина/логаута
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user?.email && session.access_token) {
                dispatch(setAuth({
                    token: session.access_token,
                    userName: session.user.email
                }));
            } else {
                dispatch(logout());
                router.replace('/auth');
            }
        });

        return () => listener.subscription.unsubscribe();
    }, [dispatch, router]);

    return <>{children}</>; // просто рендерим детей без loader
};