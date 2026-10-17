'use client'

import Link from 'next/link'
import { Category, PublicProduct } from '@/types'
import { ProductCard } from './ProductCard'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { localized } from '@/lib/i18n/format'

interface ProductRowProps {
  category: Category
  products: PublicProduct[]
}

export function ProductRow({ category, products }: ProductRowProps) {
  const { locale, t } = useLocale()
  const categoryName = localized(category, 'name', locale)
  const visibleProducts = products.slice(0, 5)
  const hasMore = products.length > 5

  return (
    <div className="mb-10 md:mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">{categoryName}</h2>
        {hasMore && (
          <Link
            href={`/catalogue?category=${category.slug}`}
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            {t.common.seeAll}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {visibleProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index === 0} categoryName={categoryName} />
        ))}
      </div>
    </div>
  )
}