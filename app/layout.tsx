import type { Metadata, Viewport } from "next"
import { Inter, Crimson_Pro, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { contact, getSiteUrl, profile } from "@/lib/content"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
// Only the weights actually used on the page are downloaded.
const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-crimson",
  display: "swap",
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false, // only used inside the terminal, which is closed on load
})

const siteUrl = getSiteUrl()
const title = `${profile.name} | ${profile.headline}`
const shortDescription = `${profile.role} at ${profile.affiliationShort} specializing in Analog IC Design, Analog Computing, and Hardware Security.`

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description: profile.description,
  keywords: [
    "Analog IC Design",
    "Mixed-Signal",
    "CMOS",
    "Hardware Security",
    "Analog Computing",
    "Neuromorphic",
    "Spiking Neural Network",
    "Ising Machine",
    "SAR ADC",
    "Ultrasound Analog Front-End",
    "Side-Channel Analysis",
    "IISc Bangalore",
    profile.name,
  ],
  authors: [{ name: profile.name, url: contact.github }],
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-light-32x32.png", sizes: "32x32", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", sizes: "32x32", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title,
    description: shortDescription,
    url: "/",
    siteName: profile.name,
    type: "profile",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} | Analog IC Design Researcher`,
    description: shortDescription,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f8fc" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1625" },
  ],
  width: "device-width",
  initialScale: 1,
}

// Structured data so search engines can show a rich "person" result.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  affiliation: { "@type": "Organization", name: profile.affiliation },
  alumniOf: { "@type": "CollegeOrUniversity", name: profile.education.institution },
  email: `mailto:${contact.email}`,
  url: siteUrl,
  sameAs: [contact.linkedin, contact.github],
  knowsAbout: profile.focusAreas,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${crimsonPro.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased bg-background">
        <a
          href="#about"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
