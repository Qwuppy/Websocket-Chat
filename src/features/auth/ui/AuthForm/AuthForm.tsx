import { useEffect, useState } from "react"
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { useRouter } from "next/navigation";

type AuthMode = "login" | "register";

export const AuthForm = () => {

    const router = useRouter();

    const [mode, setMode] = useState<AuthMode>("login")

    const toggleMode = () => {
        setMode((prev) => (prev === "login" ? "register" : "login"))
    }

    useEffect(() => {
        router.prefetch("/chat")
    }, [])

    return (
        <div>
            {mode === "login" ? <LoginForm /> : <RegisterForm />}
            
            <button type="button" onClick={toggleMode}>
                {mode === "login"
                ? "No account? Register"
                : "Already have account? Login"}
            </button>
        </div>
    )

}