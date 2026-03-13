import { useForm } from "react-hook-form"
import { LoginFormValues } from "../../model/types"
import { loginSchema } from "../../model/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/shared/lib/hooks/redux";
import { useLoginMutation } from "../../api/authApi";
import { setAuth } from "../../model/authSlice";
import { tokenStorage } from "@/shared/lib/auth/tokenStorage";


export const LoginForm = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const [loginUser] = useLoginMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    })
    
    const onSubmit = async (data: LoginFormValues) => {
        try {
            const response = await loginUser(data).unwrap();
            dispatch(setAuth({ token: response.access_token, userName: data.email }));
            tokenStorage.saveSession(data.email, response.access_token);
            router.replace('/chat');
        } catch (error: any) {

            const message = 
                (error as any)?.data?.message || // если сервер вернул объект с message
                (error as any)?.error ||         // если RTK Query error.error содержит строку
                'Ошибка логина';                 // fallback

            alert(message)
        }
    }

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

            <button type="submit">Login</button>
        </form>
    )

}