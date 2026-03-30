import type { Metadata } from 'next'
import { Inter } from 'next/font/google' // Sacamos Playfair para un look más "clean"
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Líbano Barbería | Reservas Online',
  description: 'Barbería & Academia desde 2018. Reservá tu turno para corte, color y barba en Líbano.',
  generator: 'Líbano-Dev-Team', // El toque de autor
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  )
}

