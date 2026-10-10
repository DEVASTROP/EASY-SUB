'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { WhatsAppFloat } from './WhatsAppFloat'
import { Footer } from './Footer'
import { ReactNode } from 'react'

export function PublicLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    return <main id="main-content" className="min-h-screen">{children}</main>
  }

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen">{children}</main>
      <WhatsAppFloat />
      <Footer />
    </>
  )
}