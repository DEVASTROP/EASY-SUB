'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LogoIcon } from './LogoIcon'

export function WhatsAppFloat() {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) return null

  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  const message = encodeURIComponent('Bonjour, j\'ai une question.')
  const href = phoneNumber ? `https://wa.me/${phoneNumber}?text=${message}` : '#'

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-whatsapp text-white rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
      aria-label="Nous contacter sur WhatsApp"
    >
      <LogoIcon name="whatsapp" tone="mono" size={28} />
    </Link>
  )
}