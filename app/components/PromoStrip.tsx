import Link from 'next/link'
import Image from 'next/image'
import { PublicProduct } from '@/types'

interface PromoStripProps {
  promoProducts: PublicProduct[]
}

const badgeStyles: Record<string, string> = {
  NOUVEAU: 'bg-primary/20 text-primary border-primary/30',
  PROMO: 'bg-destructive/20 text-destructive border-destructive/30',
  HOT: 'bg-warning/20 text-warning border-warning/30',
}

export function PromoStrip({ promoProducts }: PromoStripProps) {
  if (promoProducts.length === 0) return null

  return (
    <section className="bg-surface border-y border-border py-6" aria-labelledby="promo-title">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 id="promo-title" className="sr-only">Offres du moment</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 md:overflow-visible md:flex-wrap">
          {promoProducts.map(product => (
            <Link
              key={product.id}
              href={`/produit/${product.slug}`}
              className="flex-shrink-0 w-56 md:w-64 group bg-background border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300"
            >
              {product.image_url && (
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={product.image_url}
                    alt=""
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="224px"
                  />
                  {product.badge && (
                    <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold rounded ${badgeStyles[product.badge] || 'bg-muted text-muted-foreground'}`}>
                      {product.badge}
                    </span>
                  )}
                </div>
              )}
              <div className="p-3">
                <h3 className="font-medium text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    {new Intl.NumberFormat('fr-FR').format(product.sale_price_xof)} FCFA
                  </span>
                  <span className="text-xs text-muted-foreground">{product.duration}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}