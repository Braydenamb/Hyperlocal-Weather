import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from 'next-themes'

export const metadata: Metadata = {
  title: 'HyperWeather - Hyperlocal Weather Intelligence',
  description: 'Futuristic hyperlocal weather intelligence platform with real-time radar, forecasts, and analytics.',
  keywords: ['weather', 'forecast', 'radar', 'hyperlocal', 'analytics'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="font-sans bg-[#0B1020] text-slate-200 antialiased overflow-hidden">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
