import type React from "react"
import type { Metadata } from "next"
import { Poppins, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})
const _playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

export const metadata: Metadata = {
  title: "Hotel Zeeshan - Authentic Hyderabadi Cuisine",
  description: "Experience the royal taste of Hyderabadi cuisine at Hotel Zeeshan. Order biryani, tandoori, and more!",

  icons: {
    icon: [
      {
        url: "/logo.jpeg",
        type: "image/jpeg",
      },
    ],
    apple: "/logo.jpeg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
