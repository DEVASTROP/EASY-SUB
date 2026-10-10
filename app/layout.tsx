import type { Metadata } from 'next'
import './globals.css'
import { Header } from './components/Header'
import { WhatsAppFloat } from './components/WhatsAppFloat'

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
        <Header />
        <main className="pt-16">{children}</main>
        <WhatsAppFloat />
      </body>
    </html>
  )
}