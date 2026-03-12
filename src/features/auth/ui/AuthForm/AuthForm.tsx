import { useState } from "react"
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

type AuthMode = "login" | "register";

export const AuthForm = () => {

    const [mode, setMode] = useState<AuthMode>("login")

    const toggleMode = () => {
        setMode((prev) => (prev === "login" ? "register" : "login"))
    }

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