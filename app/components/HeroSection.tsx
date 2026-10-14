'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PublicProduct } from '@/types'
import { ProductImagePlaceholder } from './ProductImagePlaceholder'

interface HeroSectionProps {
  featuredProducts: PublicProduct[]
}

function calculateDiscountPercent(product: PublicProduct): number {
  if (product.original_price_xof && product.original_price_xof > product.sale_price_xof) {
    return Math.round(((product.original_price_xof - product.sale_price_xof) / product.original_price_xof) * 100)
  }
  return 0
}

function getBrandFromProduct(product: PublicProduct): string | null {
  const name = product.name.toLowerCase()
  if (name.includes('gemini')) return 'gemini'
  if (name.includes('chatgpt') || name.includes('openai') || name.includes('gpt')) return 'chatgpt'
  if (name.includes('netflix')) return 'netflix'
  if (name.includes('canva')) return 'canva'
  if (name.includes('spotify')) return 'spotify'
  if (name.includes('youtube')) return 'youtube'
  if (name.includes('disney')) return 'disney'
  if (name.includes('apple')) return 'apple'
  if (name.includes('steam')) return 'steam'
  if (name.includes('playstation') || name.includes('psn') || name.includes('ps5') || name.includes('ps4')) return 'playstation'
  if (name.includes('xbox') || name.includes('game pass')) return 'xbox'
  if (name.includes('nintendo') || name.includes('switch') || name.includes('eshop')) return 'nintendo'
  if (name.includes('google play') || name.includes('play store')) return 'google-play'
  return null
}

export function HeroSection({ featuredProducts }: HeroSectionProps) {
  const displayProducts = featuredProducts.slice(0, 4)

  if (displayProducts.length === 0) return null

  return (
    <section className="relative overflow-hidden bg-hero text-hero-foreground" aria-labelledby="hero-title">
      <div className="absolute inset-0 bg-gradient-to-b from-hero via-hero to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-primary/5 opacity-50" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="mb-8 md:mb-12">
          <h1 id="hero-title" className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center">
            Abonnements numériques <span className="text-primary">& crédits de jeu</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto">
            Tes abonnements préférés livrés sur WhatsApp en quelques minutes. Paiement Mobile Money ou dépôt bancaire.
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 md:overflow-visible md:flex-wrap md:justify-center">
          {displayProducts.map((product) => {
            const discount = calculateDiscountPercent(product)
            const brand = getBrandFromProduct(product)
            return (
              <Link
                key={product.id}
                href={`/produit/${product.slug}`}
                className="flex-shrink-0 snap-center w-[280px] md:w-[300px] group bg-background border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300"
                aria-label={`Voir ${product.name}`}
              >
                <div className="aspect-square relative overflow-hidden">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt=""
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="280px"
                    />
                  ) : (
                    <ProductImagePlaceholder productName={product.name} />
                  )}

                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                    {brand && (
                      <span className="px-2 py-1 text-xs font-bold rounded-full bg-background/90 backdrop-blur-sm text-foreground flex items-center gap-1">
                        <span className="w-4 h-4" style={{
                          maskImage: `url(/logos/${brand}.svg)`,
                          maskSize: 'contain',
                          maskRepeat: 'no-repeat',
                          maskPosition: 'center',
                          WebkitMaskImage: `url(/logos/${brand}.svg)`,
                          WebkitMaskSize: 'contain',
                          WebkitMaskRepeat: 'no-repeat',
                          WebkitMaskPosition: 'center',
                          backgroundColor: 'currentColor',
                        }} />
                        {brand.charAt(0).toUpperCase() + brand.slice(1).replace('-', ' ')}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="bg-destructive text-destructive-foreground px-2.5 py-1 text-xs font-bold rounded-full">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  {!product.in_stock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold text-lg px-4 py-2 bg-destructive/90 rounded-lg">Indisponible</span>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  {product.region_label && (
                    <p className="text-xs text-muted-foreground">{product.region_label}</p>
                  )}

                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-primary">
                      {new Intl.NumberFormat('fr-FR').format(product.sale_price_xof)} FCFA
                    </span>
                    {product.original_price_xof && product.original_price_xof > product.sale_price_xof && (
                      <span className="text-sm text-muted-foreground line-through">
                        {new Intl.NumberFormat('fr-FR').format(product.original_price_xof)} FCFA
                      </span>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                    Voir
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/catalogue"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            Voir tout le catalogue
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}