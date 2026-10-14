'use client'

import Link from 'next/link'
import { categoryTilesConfig } from './categoryTiles.config'
import { LogoIcon } from './LogoIcon'
import { Category } from '@/types'

interface CategoryTilesProps {
  categories: Category[]
}

export function CategoryTiles({ categories }: CategoryTilesProps) {
  if (categories.length === 0) return null

  // Map DB categories to config order, only include those in config
  const categoryMap = new Map(categories.map(c => [c.slug, c]))
  const sortedConfig = [...categoryTilesConfig].sort((a, b) => a.sort_order - b.sort_order)
  const displayCategories = sortedConfig
    .map(config => ({ config, db: categoryMap.get(config.slug) }))
    .filter(({ db }) => db !== undefined)
    .map(({ config, db }) => ({ config, db: db! }))

  if (displayCategories.length === 0) return null

  return (
    <section className="bg-background border-y border-border" aria-labelledby="categories-title">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
          {displayCategories.map(({ config, db }) => (
            <Link
              key={db.id}
              href={`/catalogue?category=${db.slug}`}
              className="flex flex-col items-center gap-2 px-4 py-3 md:px-6 md:py-4 min-w-[100px] md:min-w-[120px] snap-center bg-surface rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
              aria-label={`Voir ${config.name}`}
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {config.logo ? (
                  <LogoIcon name={config.logo} tone="brand" size={28} />
                ) : (
                  <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                )}
              </div>
              <span className="text-sm md:text-base font-medium text-foreground whitespace-nowrap">{config.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}