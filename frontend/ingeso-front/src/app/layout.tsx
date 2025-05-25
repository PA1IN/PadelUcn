import type React from "react"
import Providers from "./providers"
import "./globals.css"

export const metadata = {
  title: "Reservas",
  description: "Sistema de reservas",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-white text-black">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
