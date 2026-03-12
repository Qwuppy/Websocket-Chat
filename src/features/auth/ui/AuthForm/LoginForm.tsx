import { useForm } from "react-hook-form"
import { LoginFormValues } from "../../model/types"
import { loginSchema } from "../../model/validation"
import { zodResolver } from "@hookform/resolvers/zod"



export const LoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    })
    
    const onSumbit = (data: LoginFormValues) => {
        console.log("Login data: ", data)
        //вызов к апи
        //запись в стор

    }

    return (
        <form onSubmit={handleSubmit(onSumbit)}>
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