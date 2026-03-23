import { useForm } from "react-hook-form"
import { LoginFormValues } from "../../model/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation";
import { useLoginMutation } from "../../api/authApi";
import { loginSchema } from "../../model/validation";
import { useState } from "react";
import { Button, Stack, TextField } from "@mui/material";
import { adp } from "@/shared/lib/utils/adaptiveDesktop";
import { useTranslation } from "react-i18next";


export const LoginForm = () => {

    const router = useRouter();
    const [loginUser, { isLoading }] = useLoginMutation();

    const [errorMsg, setErrorMsg] = useState('');

    const { t } = useTranslation();

    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const response = await loginUser(data).unwrap();

            if (!response.access_token) throw new Error('Нет токена после login');

            router.replace('/chat');
        } catch (error: any) { setErrorMsg(error.data || 'Ошибка логина') }

    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack
                direction='column'
                spacing={adp(10)}
            >
                <TextField 
                    id="login-email" 
                    label={t('auth.email')} 
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
                    id="login-password" 
                    label={t('auth.password')} 
                    variant='outlined' 
                    type="password" 
                    {...register("password")}
                    sx={{
                        width: adp(360),
                    }}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />
                <Button variant="contained" disabled={isLoading} type="submit">
                    {isLoading ? 'Входим...' : t('auth.login')}
                </Button>
                {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
            </Stack>
        </form>
    )

}