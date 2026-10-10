import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import { PublicLayout } from './components/PublicLayout'

export const metadata: Metadata = {
  title: 'EASY-SUB - Abonnements numériques et crédits de jeu',
  description: 'Catalogue d\'abonnements numériques (Gemini Pro, ChatGPT Plus, Canva Pro, Netflix) et crédits de jeu pour étudiants au Togo. Paiement Mobile Money / virement, livraison sur WhatsApp.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen">
        <Suspense fallback={null}>
          <PublicLayout>{children}</PublicLayout>
        </Suspense>
      </body>
    </html>
  )
}