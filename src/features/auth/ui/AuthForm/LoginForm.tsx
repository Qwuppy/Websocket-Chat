import { useForm } from "react-hook-form"
import { LoginFormValues } from "../../model/types"
import { loginSchema } from "../../model/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/shared/lib/hooks/redux";
import { authApi } from "../../api/authApi";
import { setAuth } from "../../model/authSlice";
import React from "react";


export const LoginForm = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const [loginUser] = authApi.useLoginMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    })

    const handleLogin = async (email: string, password: string) => {
        try {
            const response = await loginUser({ companyName: 'NoCompany', userName: email, email, password }).unwrap();
            dispatch(setAuth({ token: response.token, user: response.user }));
            router.replace('/chat');
        } catch (error: any) {
            alert(error.message || 'Ошибка логина')
        }
    }
    
    const onSubmit = async (data: LoginFormValues) => {

        handleLogin(data.email, data.password);

    }

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

            <button type="submit">Login</button>
        </form>
    )

}