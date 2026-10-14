'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PublicProduct } from '@/types'
import { ProductImagePlaceholder } from './ProductImagePlaceholder'

interface ProductCardProps {
  product: PublicProduct
  priority?: boolean
  categoryName?: string
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

export function ProductCard({ product, priority = false, categoryName }: ProductCardProps) {
  const discount = calculateDiscountPercent(product)

  return (
    <Link
      href={`/produit/${product.slug}`}
      className="group bg-background border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300"
    >
      <div className="aspect-square relative overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt=""
            fill
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, 20vw"
          />
        ) : (
          <ProductImagePlaceholder productName={product.name} />
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {product.badge && (
            <span className={`px-2 py-1 text-xs font-bold rounded ${badgeStyles[product.badge] || 'bg-muted text-muted-foreground'}`}>
              {product.badge}
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
            <span className="text-white font-bold text-lg px-4 py-2 bg-destructive/90 rounded-lg">Indisponible</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground flex items-center gap-1 flex-wrap mb-1.5">
          {categoryName && <span>{categoryName}</span>}
          {categoryName && <span>·</span>}
          <span>{product.duration}</span>
          {product.region_label && (
            <>
              <span>·</span>
              <span>{product.region_label}</span>
            </>
          )}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-primary">
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
}