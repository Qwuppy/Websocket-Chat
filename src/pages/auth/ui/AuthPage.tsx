'use client'

import { AuthForm } from "@/features/auth/ui"
import { Box } from "@mui/material"

export const AuthPage = () => {
  return (
    <Box
      sx={{
        m: 0,
        p: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: '#1F1D1D',
        display: 'flex',
        justifyContent: 'center', // по горизонтали
        alignItems: 'center',     // по вертикали
      }}
    >
      <AuthForm />
    </Box>
      


  
  )
}