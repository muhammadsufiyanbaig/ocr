import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DS-OCR Bank - Account Applications",
  description: "Bank Account Applications Management System with OCR",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased gradient-bg">
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'hsl(260, 15%, 16%)',
              border: '1px solid hsl(260, 10%, 28%)',
              color: 'hsl(260, 10%, 95%)',
            },
            classNames: {
              success: 'border-emerald-500/50',
              error: 'border-red-500/50',
              warning: 'border-amber-500/50',
              info: 'border-blue-500/50',
            },
          }}
          richColors
          closeButton
        />
        <Analytics />
      </body>
    </html>
  )
}
