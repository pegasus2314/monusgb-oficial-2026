"use client"
import type { Metadata } from 'next'
import { Anton, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AuthProvider } from '../lib/auth'
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MONUSGB 2026 — Modelo Distrital de Naciones Unidas',
  description:
    'La plataforma oficial del Modelo Distrital de Naciones Unidas 2026. Comisiones, delegados, cronograma e inscripciones.',
  generator: 'v0.app',
  keywords: ['MUN', 'Naciones Unidas', 'MONUSGB', 'Modelo ONU', 'diplomacia'],
}

export const viewport = {
  themeColor: '#021f37',
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
 return (
  <html lang="es" className={`${inter.variable} ${anton.variable}`}>
    <body className="font-sans antialiased">
      <AuthProvider> 
        {children}
        <Analytics />
      </AuthProvider>
    </body>
  </html>
    )
}
