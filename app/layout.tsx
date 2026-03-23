import { ReduxProvider } from "@/app/providers/ReduxProvider"
import Providers from "@/app/providers/MuiProvider"
import { I18nProvider } from "@/app/providers/I18nProvider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
          <ReduxProvider>
            <I18nProvider>
              <Providers>
                {children}
              </Providers>
            </I18nProvider>
          </ReduxProvider>
      </body>
    </html>
  )
}