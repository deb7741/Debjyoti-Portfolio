import type { Metadata, Viewport } from 'next'
import { Inter, Crimson_Pro, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const crimsonPro = Crimson_Pro({ 
  subsets: ['latin'],
  variable: '--font-crimson',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Debjyoti Chowbey | Analog & Mixed-Signal IC Design Researcher',
  description: 'Research Associate at IISc Bangalore specializing in Analog & Mixed-Signal IC Design, Analog Computing, and Hardware Security. Exploring low-power CMOS design, neuromorphic circuits, and side-channel analysis.',
  keywords: ['Analog IC Design', 'Mixed-Signal', 'CMOS', 'Hardware Security', 'Analog Computing', 'Neuromorphic', 'IISc Bangalore'],
  authors: [{ name: 'Debjyoti Chowbey' }],
  openGraph: {
    title: 'Debjyoti Chowbey | Analog & Mixed-Signal IC Design Researcher',
    description: 'Research Associate at IISc Bangalore specializing in Analog IC Design, Analog Computing, and Hardware Security.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Debjyoti Chowbey | Analog IC Design Researcher',
    description: 'Research Associate at IISc Bangalore specializing in Analog IC Design, Analog Computing, and Hardware Security.',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f8fc' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1625' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${crimsonPro.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
