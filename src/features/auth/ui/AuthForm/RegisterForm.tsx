import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "../../api/authApi";
import { RegisterFormValues } from "../../model/types";
import { registerSchema } from "../../model/validation";

export const RegisterForm = () => {
    const router = useRouter();
    const [registerUser, { isLoading }] = useRegisterMutation();
    const [errorMsg, setErrorMsg] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setErrorMsg('');
        try {
            const response = await registerUser({
                email: data.email,
                password: data.password,
            }).unwrap();

            // Если email-подтверждение включено в Supabase — токена не будет.
            // AuthProvider сам обработает сессию через onAuthStateChange после редиректа.
            if (!response.access_token) {
                // Сообщаем пользователю что нужно подтвердить email
                setErrorMsg('Проверьте почту и подтвердите email для входа');
                return;
            }

            // Токен есть — редиректим, AuthProvider подхватит сессию сам
            router.replace('/chat');

        } catch (error: any) {
            setErrorMsg(error.data || error.message || 'Ошибка регистрации');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <input placeholder="Email" {...register("email")} />
                {errors.email && <p>{errors.email.message}</p>}
            </div>
            <div>
                <input type="password" placeholder="Password" {...register("password")} />
                {errors.password && <p>{errors.password.message}</p>}
            </div>
            <div>
                <input type="password" placeholder="Confirm Password" {...register("confirmPassword")} />
                {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
            </div>

            {/* Ошибки через state, не через alert */}
            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Регистрируем...' : 'Register'}
            </button>
        </form>
    );
};