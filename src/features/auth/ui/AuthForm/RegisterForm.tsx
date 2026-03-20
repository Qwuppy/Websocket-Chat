import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "../../api/authApi";
import { RegisterFormValues } from "../../model/types";
import { registerSchema } from "../../model/validation";
import { Alert, Button, Stack, TextField } from "@mui/material";
import { adp } from "@/shared/lib/utils/adaptiveDesktop";

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
            <Stack
                direction='column'
                spacing={adp(10)}
            >
                <TextField
                    id="register-email" 
                    label='Email' 
                    variant='outlined' 
                    {...register("email")} 
                    type="email"
                    sx={{
                        width: adp(360),
                    }}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />
                <TextField 
                    id="register-password" 
                    label='Password' 
                    variant='outlined' 
                    type="password" 
                    {...register("password")}
                    sx={{
                        width: adp(360),
                    }}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />
                <TextField 
                    id="register-confirm-password" 
                    label='Confirm Password' 
                    variant='outlined' 
                    type="password" 
                    {...register("confirmPassword")}
                    sx={{
                        width: adp(360),
                    }}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                />
                <Button variant="contained" disabled={isLoading} type="submit">
                    {isLoading ? 'Регистрируем...' : 'Register'}
                </Button>
                {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
            </Stack>
            
        </form>
    );
};