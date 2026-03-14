import { useForm } from "react-hook-form"
import { LoginFormValues } from "../../model/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/shared/lib/hooks/redux";
import { useLoginMutation } from "../../api/authApi";
import { setAuth } from "../../model/authSlice";


export const LoginForm = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const [loginUser] = useLoginMutation();

    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm<LoginFormValues>({
        resolver: zodResolver(require('../../model/validation').loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const response = await loginUser(data).unwrap();

            if (!response.access_token) throw new Error('Нет токена после login');

            dispatch(setAuth({ token: response.access_token, userName: data.email }));
            router.replace('/chat');
        } catch (error: any) {
            alert(error.data || 'Ошибка логина');
        }
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

            <button type="submit">Login</button>
        </form>
    )

}