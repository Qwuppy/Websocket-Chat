import { useForm } from "react-hook-form"
import { RegisterFormValues } from "../../model/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "../../model/validation"
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/shared/lib/hooks/redux";
import { useRegisterMutation } from "../../api/authApi";
import { setAuth } from "../../model/authSlice";
import { tokenStorage } from "@/shared/lib/auth/tokenStorage";


export const RegisterForm = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const [registerUser] = useRegisterMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    })

    const handleLogin = async (email: string, password: string) => {
        try {
            const response = await registerUser({ companyName: 'NoCompany', userName: email, email, password }).unwrap();
            dispatch(setAuth({ token: response.access_token, userName: email }));
            router.replace('/chat');
        } catch (error: any) {
            alert(error.message || 'Ошибка регистрации')
        }
    }

    const onSubmit = async (data: RegisterFormValues) => {

        try {
            const response = await registerUser({ companyName: 'NoCompany', userName: data.email, email: data.email, password: data.password }).unwrap();
            dispatch(setAuth({ token: response.access_token, userName: data.email }));
            tokenStorage.saveSession(data.email, response.access_token);
            router.replace('/chat');
        } catch (error: any) {
            const message = 
                (error as any)?.data?.message || // если сервер вернул объект с message
                (error as any)?.error ||         // если RTK Query error.error содержит строку
                'Ошибка регистрации';            // fallback

            alert(message)
        }


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
            <div>
                <input type="password" placeholder="Confirm Password" {...register("confirmPassword")} />
                {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit">Register</button>
        </form>
    )

}