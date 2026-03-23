import { useEffect, useState } from "react"
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { useRouter } from "next/navigation";
import { Box, Button, Stack } from "@mui/material";
import { adp } from "@/shared/lib/utils/adaptiveDesktop";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/shared/ui/LanguageSwitcher/LanguageSwitcher";

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

    const { t } = useTranslation();

    return (
        <Stack
            direction='column'
            spacing={adp(10)}
            width={adp(400)}
            minHeight={adp(150)}
            bgcolor='#262424'
            p={adp(20)}
            borderRadius={adp(20)}
            sx={{
                '& .MuiOutlinedInput-root': {
                    color: '#d4d4d4ff',
                    '& fieldset': {
                        borderColor: '#414040ff',
                    },
                    '&:hover fieldset': {
                        borderColor: 'rgba(53, 77, 97, 1)',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'rgba(32, 88, 145, 1)',
                    },
                    backgroundColor: '#262424',         // фон всегда
                    '&.Mui-focused': {
                        backgroundColor: '#262424',       // фон при фокусе (когда пишешь)
                    },
                    '& input:-webkit-autofill': {           //автозаполнение
                        WebkitBoxShadow: '0 0 0 100px #262424 inset',  
                        WebkitTextFillColor: '#d4d4d4ff',                  
                    },
                },
                '& .MuiInputLabel-root': {
                        color: '#bdbdbda9',      // обычное состояние
                    '&.Mui-focused': {
                        color: '#d4d4d4ff',                      // при фокусе
                    },
                },
            }}
        >
            {mode === "login" ? <LoginForm /> : <RegisterForm />}
            <Button 
                variant="contained" 
                type="button" 
                onClick={toggleMode}
                sx={{
                    width: adp(360),
                    height: adp(36),
                    borderRadius: adp(6),
                    border: 'none',
                    backgroundColor: '#322F2F'
                }}
            >
                {
                    mode === "login"
                    ? t('auth.noAccount')
                    : t('auth.hasAccount')
                }
            </Button>
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
            >
                <LanguageSwitcher />
            </Box>
        </Stack>
    )

}