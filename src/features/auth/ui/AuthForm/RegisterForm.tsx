import { useForm } from "react-hook-form"
import { RegisterFormValues } from "../../model/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/shared/lib/hooks/redux";
import { useRegisterMutation } from "../../api/authApi";
import { setAuth } from "../../model/authSlice";

export const RegisterForm = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const [registerUser] = useRegisterMutation();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(require('../../model/validation').registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            // 🔹 Регистрируем через RTK Query, Supabase внутри возвращает JWT
            const response = await registerUser({
                email: data.email,
                password: data.password
            }).unwrap();

            if (!response.access_token) throw new Error('Не удалось получить токен после регистрации');

            // 🔹 Сохраняем токен и email в Redux
            dispatch(setAuth({
                token: response.access_token,
                userName: data.email
            }));

            // 🔹 Переходим на чат
            router.replace('/chat');

        } catch (error: any) {
            const message = error.data?.message || error.message || 'Ошибка регистрации';
            alert(message);
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

            <button type="submit">Register</button>
        </form>
    )

}