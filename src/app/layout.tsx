import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "mpro5 Theme Generator - Create Custom Themes",
  description:
    "Professional theme generator for mpro5 Saturn mobile app. Create, preview, and export custom color themes with real-time preview.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
      <head>
        <style>{`
          :root {
            --font-sans: ${dmSans.style.fontFamily};
            --font-heading: ${spaceGrotesk.style.fontFamily};
          }
        `}</style>
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
