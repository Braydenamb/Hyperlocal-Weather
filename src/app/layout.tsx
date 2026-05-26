import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from './providers';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HyperWeather — Street-Level Weather Intelligence',
  description:
    'Real-time hyperlocal weather dashboard with street-level precision. Live radar, interactive maps, hourly & 7-day forecasts, air quality monitoring, and community weather reports.',
  keywords: [
    'weather',
    'hyperlocal',
    'forecast',
    'radar',
    'air quality',
    'dashboard',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
