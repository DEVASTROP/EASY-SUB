'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LogoIcon } from './LogoIcon'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { buildWhatsAppQuestionLink } from '@/lib/whatsapp'

export function WhatsAppFloat() {
  const pathname = usePathname()
  const { locale, t } = useLocale()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) return null

  const href = buildWhatsAppQuestionLink(locale)

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-whatsapp text-white rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
      aria-label={t.common.whatsappAriaLabel}
    >
      <LogoIcon name="whatsapp" tone="mono" size={28} />
    </Link>
  )
}