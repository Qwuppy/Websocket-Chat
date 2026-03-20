import { ReduxProvider } from "@/app/providers/ReduxProvider"
import Providers from "@/app/providers/MuiProvider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </Providers>
      </body>
    </html>
  )
}