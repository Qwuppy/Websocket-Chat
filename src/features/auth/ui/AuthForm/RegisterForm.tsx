import { useForm } from "react-hook-form"
import { RegisterFormValues } from "../../model/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "../../model/validation"


export const RegisterForm = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    })

    const onSumbit = (data: RegisterFormValues) => {
        console.log("Register data: ", data)
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
                <input placeholder="Username" {...register("username")} />
                {errors.username && <p>{errors.username.message}</p>}
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