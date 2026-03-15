import { useForm } from "react-hook-form"
import { LoginFormValues } from "../../model/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation";
import { useLoginMutation } from "../../api/authApi";
import { loginSchema } from "../../model/validation";
import { useState } from "react";


export const LoginForm = () => {

    const router = useRouter();
    const [loginUser, { isLoading }] = useLoginMutation();

    const [errorMsg, setErrorMsg] = useState('');

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
            <div>
                <input placeholder="Email" {...register("email")} type="email"/>
                {errors.email && <p>{errors.email.message}</p>}
            </div>

            <div>
                <input type="password" placeholder="Password" {...register("password")} />
                {errors.password && <p>{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Входим...' : 'Login'}
            </button>
            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        </form>
    )

}