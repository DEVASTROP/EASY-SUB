'use client'

import { PublicProduct } from '@/types'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import { LogoIcon } from './LogoIcon'
import { useLocale } from '@/lib/i18n/LocaleProvider'

interface WhatsAppOrderButtonProps {
  product: PublicProduct
  className?: string
}

export function WhatsAppOrderButton({ product, className = '' }: WhatsAppOrderButtonProps) {
  const { locale, t } = useLocale()
  const href = buildWhatsAppLink(product, locale)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity ${className}`}
    >
      <LogoIcon name="whatsapp" tone="mono" size={24} />
      {t.common.orderOnWhatsApp}
    </a>
  )
}