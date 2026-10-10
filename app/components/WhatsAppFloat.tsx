'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

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
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
      aria-label="Nous contacter sur WhatsApp"
    >
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.472.099-.174.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378 3.41 3.41 0 01-1.156-.688C1.69 19.413.92 18.996.55 18.418.363 18.144.304 17.823.42 17.465c.327-.992 1.497-5.426 5.605-9.56a9.915 9.915 0 016.845 2.664c1.197 1.01 2.145 2.228 2.763 3.645.253.582.315 1.142.243 1.424-.13.506-.965 2.782-2.73 4.065-.954.697-2.019 1.218-3.125 1.497-.297.093-.557.145-.878.073l-.004-.003z"/>
      </svg>
    </Link>
  )
}