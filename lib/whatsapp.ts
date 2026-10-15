import { PublicProduct } from '@/types'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { fill, formatDuration, formatPrice, localized, type Locale } from '@/lib/i18n/format'

export function buildWhatsAppLink(product: PublicProduct, locale: Locale = 'fr'): string {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  if (!phoneNumber) {
    console.warn('NEXT_PUBLIC_WHATSAPP_NUMBER not set')
    return '#'
  }

  const t = getDictionary(locale)
  const message = fill(t.common.orderMessage, {
    name: localized(product, 'name', locale),
    duration: formatDuration(product.duration, locale),
    price: formatPrice(product.sale_price_xof, locale),
  })

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
}

export function buildWhatsAppQuestionLink(locale: Locale = 'fr'): string {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  if (!phoneNumber) return '#'
  const t = getDictionary(locale)
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(t.common.whatsappQuestion)}`
}
