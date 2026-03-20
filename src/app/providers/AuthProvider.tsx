'use client'

import { useEffect, ReactNode, useState } from "react";
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
    const [isChecking, setIsChecking] = useState(true); // 👈

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user?.email && session.access_token) {
                dispatch(setAuth({
                    token: session.access_token,
                    userName: session.user.email,
                }));
            } else {
                dispatch(logout());
                router.replace('/auth');
            }
            setIsChecking(false);
        });

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

        return () => listener.subscription.unsubscribe();
    }, [dispatch, router]);

    if (isChecking) return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
        }}>
            <span>Загрузка...</span>
        </div>
    );

    return <>{children}</>;
};