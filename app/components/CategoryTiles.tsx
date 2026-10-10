import Link from 'next/link'
import { PublicProduct, Category } from '@/types'

interface CategoryTilesProps {
  categories: Category[]
  products: PublicProduct[]
}

export function CategoryTiles({ categories, products }: CategoryTilesProps) {
  if (categories.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-background" aria-labelledby="categories-title">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <header className="text-center mb-12">
          <h2 id="categories-title" className="text-3xl md:text-4xl font-bold mb-4">Nos catégories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Trouve l'abonnement ou le crédit qu'il te faut</p>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map(category => {
            const count = products.filter(p => p.category_id === category.id && p.in_stock).length
            return (
              <Link
                key={category.id}
                href={`/catalogue?category=${category.slug}`}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-surface border border-border hover:border-primary/50 transition-colors"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
                <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.slug === 'ia-et-outils' && (
                      <svg className="w-8 h-8 md:w-10 md:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                    {category.slug === 'divertissement' && (
                      <svg className="w-8 h-8 md:w-10 md:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                    {category.slug === 'jeux' && (
                      <svg className="w-8 h-8 md:w-10 md:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    )}
                    {category.slug !== 'ia-et-outils' && category.slug !== 'divertissement' && category.slug !== 'jeux' && (
                      <svg className="w-8 h-8 md:w-10 md:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg md:text-xl group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {count} offres
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}