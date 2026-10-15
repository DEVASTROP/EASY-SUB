'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PublicProduct, Category } from '@/types'
import { ProductImagePlaceholder } from './ProductImagePlaceholder'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { formatDuration, formatPrice, localized, type Locale } from '@/lib/i18n/format'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface PromoStripProps {
  promoProducts: PublicProduct[]
  categories: Category[]
}

const badgeStyles: Record<string, string> = {
  NOUVEAU: 'bg-primary/20 text-primary border-primary/30',
  PROMO: 'bg-destructive/20 text-destructive border-destructive/30',
  HOT: 'bg-warning/20 text-warning border-warning/30',
}

function calculateDiscountPercent(product: PublicProduct): number {
  if (product.original_price_xof && product.original_price_xof > product.sale_price_xof) {
    return Math.round(((product.original_price_xof - product.sale_price_xof) / product.original_price_xof) * 100)
  }
  return 0
}

function getCategoryName(categories: Category[], categoryId: string, locale: Locale, t: Dictionary): string {
  const cat = categories.find(c => c.id === categoryId)
  return cat ? localized(cat, 'name', locale) : t.common.categoryFallback
}

export function PromoStrip({ promoProducts, categories }: PromoStripProps) {
  const { locale, t } = useLocale()
  if (promoProducts.length === 0) return null

  return (
    <section className="bg-surface border-y border-border py-6" aria-labelledby="promo-title">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 id="promo-title" className="sr-only">{t.promo.title}</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 md:overflow-visible md:flex-wrap">
          {promoProducts.map(product => {
            const discount = calculateDiscountPercent(product)
            const categoryName = getCategoryName(categories, product.category_id, locale, t)
            const productName = localized(product, 'name', locale)
            return (
              <Link
                key={product.id}
                href={`/produit/${product.slug}`}
                className="flex-shrink-0 w-56 md:w-64 group bg-background border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300"
              >
                <div className="aspect-square relative overflow-hidden">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt=""
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="224px"
                    />
                  ) : (
                    <ProductImagePlaceholder productName={product.name} />
                  )}
                  <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                    {product.badge && (
                      <span className={`px-2 py-1 text-xs font-bold rounded ${badgeStyles[product.badge] || 'bg-muted text-muted-foreground'}`}>
                        {(t.common.badges as Record<string, string>)[product.badge] ?? product.badge}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="bg-destructive text-destructive-foreground px-2 py-1 text-xs font-bold rounded">
                        -{discount}%
                      </span>
                    )}
                  </div>
                  {!product.in_stock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold text-lg px-4 py-2 bg-destructive/90 rounded-lg">{t.common.unavailable}</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {productName}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 flex-wrap mb-1.5">
                    <span>{categoryName}</span>
                    <span>·</span>
                    <span>{formatDuration(product.duration, locale)}</span>
                    {product.region_label && (
                      <>
                        <span>·</span>
                        <span>{product.region_label}</span>
                      </>
                    )}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-primary">
                      {product.sale_price_xof > 0 ? formatPrice(product.sale_price_xof, locale) : t.common.priceOnRequest}
                    </span>
                    {product.original_price_xof && product.original_price_xof > product.sale_price_xof && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.original_price_xof, locale)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}