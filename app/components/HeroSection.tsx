'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PublicProduct } from '@/types'
import { ProductImagePlaceholder } from './ProductImagePlaceholder'
import { brandLogoFor } from '@/lib/logos'

const HERO_BG = '/hero-bg.jpg'
const HERO_BG_ENABLED = true
const HERO_OVERLAY_OPACITY = 0.35

function calculateDiscountPercent(product: PublicProduct): number {
  if (product.original_price_xof && product.original_price_xof > product.sale_price_xof) {
    return Math.round(((product.original_price_xof - product.sale_price_xof) / product.original_price_xof) * 100)
  }
  return 0
}

function getBadgeLabel(badge?: string): string | null {
  if (!badge) return null
  const labels: Record<string, string> = {
    NOUVEAU: 'NOUVEAU',
    PROMO: 'PROMO',
    HOT: 'HOT',
  }
  return labels[badge] || null
}

export function HeroSection({ featuredProducts }: { featuredProducts: PublicProduct[] }) {
  const displayProducts = featuredProducts.slice(0, 4)

  if (displayProducts.length === 0) return null

  return (
    <section className="relative overflow-hidden bg-hero text-hero-foreground" aria-labelledby="hero-title">
      {HERO_BG_ENABLED && (
        <>
          <Image
            src={HERO_BG}
            alt=""
            fill
            priority
            className="absolute inset-0 object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-hero"
            style={{ opacity: HERO_OVERLAY_OPACITY }}
            aria-hidden="true"
          />
        </>
      )}

      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((product, index) => {
            const discount = calculateDiscountPercent(product)
            const badge = getBadgeLabel(product.badge ?? undefined)
            const logo = brandLogoFor(product.name)

            return (
              <Link
                key={product.id}
                href={`/produit/${product.slug}`}
                className="group block bg-surface/95 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt=""
                      fill
                      priority={index === 0}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  ) : logo ? (
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <Image
                        src={`/logos/${logo.name}.svg`}
                        alt={logo.name}
                        width={96}
                        height={96}
                        className="opacity-80"
                        aria-hidden="true"
                      />
                    </div>
                  ) : (
                    <ProductImagePlaceholder productName={product.name} />
                  )}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {discount > 0 && (
                      <span className="bg-discount text-white text-xs font-bold px-2.5 py-1 rounded transform -skew-x-6">
                        -{discount}%
                      </span>
                    )}
                    {badge && (
                      <span className="bg-primary/90 text-primary-foreground text-xs font-bold px-2.5 py-1 rounded">
                        {badge}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="text-lg md:text-xl font-bold uppercase leading-tight group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span>Catégorie</span>
                    <span>·</span>
                    <span>{product.duration}</span>
                    <span>·</span>
                    <span>{product.region_label || 'REGION'}</span>
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-foreground">
                      {new Intl.NumberFormat('fr-FR').format(product.sale_price_xof)} FCFA
                    </span>
                    {product.original_price_xof && product.original_price_xof > product.sale_price_xof && (
                      <span className="text-sm text-muted-foreground line-through">
                        {new Intl.NumberFormat('fr-FR').format(product.original_price_xof)} FCFA
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