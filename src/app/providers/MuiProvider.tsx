'use client'
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material'

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { margin: 0, padding: 0, boxSizing: 'border-box' },
      },
    },
  },
})

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
