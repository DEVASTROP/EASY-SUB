'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PublicProduct } from '@/types'

interface ProductCardProps {
  product: PublicProduct
  priority?: boolean
}

const badgeStyles: Record<string, string> = {
  NOUVEAU: 'bg-primary/20 text-primary border-primary/30',
  PROMO: 'bg-destructive/20 text-destructive border-destructive/30',
  HOT: 'bg-warning/20 text-warning border-warning/30',
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <Link
      href={`/produit/${product.slug}`}
      className="group bg-background border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300"
    >
      {product.image_url && (
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.image_url}
            alt=""
            fill
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, 20vw"
          />
          {product.badge && (
            <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded ${badgeStyles[product.badge] || 'bg-muted text-muted-foreground'}`}>
              {product.badge}
            </span>
          )}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-lg px-4 py-2 bg-destructive/90 rounded-lg">Indisponible</span>
            </div>
          )}
        </div>
      )}
      <div className="p-3">
        <h3 className="font-medium text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{product.short_description}</p>
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-primary">
            {new Intl.NumberFormat('fr-FR').format(product.sale_price_xof)} FCFA
          </span>
          <span className="text-xs text-muted-foreground">{product.duration}</span>
        </div>
      </div>
    </Link>
  )
}