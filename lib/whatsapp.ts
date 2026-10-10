import { PublicProduct } from '@/types'

export function buildWhatsAppLink(product: PublicProduct): string {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  if (!phoneNumber) {
    console.warn('NEXT_PUBLIC_WHATSAPP_NUMBER not set')
    return '#'
  }

  const priceFormatted = new Intl.NumberFormat('fr-FR').format(product.sale_price_xof)
  const message = `Bonjour, je souhaite commander : ${product.name} (${product.duration}) à ${priceFormatted} FCFA.`
  const encodedMessage = encodeURIComponent(message)

  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
}