import { Product } from '@/types'

export interface MarginResult {
  costXof: number
  marginXof: number
  marginPercent: number
}

export function computeMargin(product: Product): MarginResult {
  const costXof = product.purchase_price_usd * product.exchange_rate * (1 + product.card_fees_percent / 100)
  const marginXof = product.sale_price_xof - costXof
  const marginPercent = product.sale_price_xof > 0 ? (marginXof / product.sale_price_xof) * 100 : 0

  return {
    costXof: Math.round(costXof),
    marginXof: Math.round(marginXof),
    marginPercent: Math.round(marginPercent * 100) / 100,
  }
}