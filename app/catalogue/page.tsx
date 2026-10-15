import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PublicProduct, Category } from '@/types'
import { ProductCard } from '../components/ProductCard'
import { ProductRow } from '../components/ProductRow'
import { getServerI18n } from '@/lib/i18n/server'
import { fill, localized } from '@/lib/i18n/format'

interface SearchParams {
  q?: string
  category?: string
  sort?: 'price-asc' | 'price-desc' | 'newest' | 'discount-desc'
  badge?: string
}

function calculateDiscountPercent(product: PublicProduct): number {
  if (product.original_price_xof && product.original_price_xof > product.sale_price_xof) {
    return Math.round(((product.original_price_xof - product.sale_price_xof) / product.original_price_xof) * 100)
  }
  return 0
}

function buildHref(params: SearchParams, changes: Record<string, string | undefined>): string {
  const searchParams = new URLSearchParams()
  Object.entries({ ...params, ...changes }).forEach(([key, value]) => {
    if (value) searchParams.set(key, value)
  })
  const qs = searchParams.toString()
  return qs ? `/catalogue?${qs}` : '/catalogue'
}

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  return data || []
}

async function getFilteredProducts(searchParams: SearchParams): Promise<PublicProduct[]> {
  const supabase = await createClient()
  let query = supabase.from('public_products').select('*')

  if (searchParams.category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', searchParams.category)
      .single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  if (searchParams.q) {
    query = query.ilike('name', `%${searchParams.q}%`)
  }

  if (searchParams.badge) {
    query = query.eq('badge', searchParams.badge)
  }

  // Default ordering: in-stock first, then by created_at desc
  query = query.order('in_stock', { ascending: false }).order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  let products = data || []

  // Apply sort in JavaScript for discount-desc
  if (searchParams.sort === 'discount-desc') {
    products = products.sort((a, b) => {
      // In-stock products first
      if (a.in_stock !== b.in_stock) {
        return a.in_stock ? -1 : 1
      }
      // Then by discount percent descending
      const discountA = calculateDiscountPercent(a)
      const discountB = calculateDiscountPercent(b)
      return discountB - discountA
    })
  } else if (searchParams.sort === 'price-asc') {
    products = products.sort((a, b) => {
      if (a.in_stock !== b.in_stock) return a.in_stock ? -1 : 1
      return a.sale_price_xof - b.sale_price_xof
    })
  } else if (searchParams.sort === 'price-desc') {
    products = products.sort((a, b) => {
      if (a.in_stock !== b.in_stock) return a.in_stock ? -1 : 1
      return b.sale_price_xof - a.sale_price_xof
    })
  } else {
    // newest - already sorted by created_at desc from DB
    products = products.sort((a, b) => {
      if (a.in_stock !== b.in_stock) return a.in_stock ? -1 : 1
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }

  return products
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchParams> }): Promise<Metadata> {
  const params = await searchParams
  const { locale, t } = await getServerI18n()
  const categorySlug = params.category
  let title = `${t.catalogue.metaTitle} - EASY-SUB`

  if (categorySlug) {
    const supabase = await createClient()
    const { data: cat } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', categorySlug)
      .single()
    if (cat) title = `${localized(cat, 'name', locale)} - EASY-SUB`
  } else if (params.q) {
    title = `${fill(t.catalogue.searchTitle, { q: params.q })} - EASY-SUB`
  }

  return {
    title,
    description: t.catalogue.metaDescription,
    openGraph: {
      title,
      description: t.catalogue.metaDescription,
      type: 'website',
    },
  }
}

export default async function CataloguePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const { locale, t } = await getServerI18n()
  const [categories, products] = await Promise.all([
    getCategories(),
    getFilteredProducts(params),
  ])

  const productsByCategory = categories.map(category => ({
    category,
    products: products.filter(p => p.category_id === category.id),
  })).filter(({ products }) => products.length > 0)

  const activeCategory = categories.find(c => c.slug === params.category)
  const currentSort = params.sort || 'newest'
  const currentBadge = params.badge

  const sortOptions = [
    { value: 'newest', label: t.catalogue.sort.newest },
    { value: 'price-asc', label: t.catalogue.sort.priceAsc },
    { value: 'price-desc', label: t.catalogue.sort.priceDesc },
    { value: 'discount-desc', label: t.catalogue.sort.discountDesc },
  ] as const

  const isEmptyCategoryView = products.length === 0 && !!params.category && !params.q && !params.badge

  const badges = ['NOUVEAU', 'PROMO', 'HOT'] as const

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {activeCategory ? localized(activeCategory, 'name', locale) : t.catalogue.fullCatalogue}
          </h1>
          <p className="text-muted-foreground">
            {fill(products.length > 1 ? t.catalogue.resultMany : t.catalogue.resultOne, { n: products.length })}
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-surface p-4 rounded-xl border border-border">
              <h3 className="font-semibold mb-3">{t.catalogue.categoriesTitle}</h3>
              <nav className="space-y-2" aria-label={t.catalogue.filterAria}>
                <Link
                  href={buildHref(params, { category: undefined })}
                  className={`block px-3 py-2 rounded-lg transition-colors ${
                    !params.category ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                  }`}
                >
                  {t.catalogue.seeEverything}
                </Link>
                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    href={buildHref(params, { category: cat.slug })}
                    className={`block px-3 py-2 rounded-lg transition-colors ${
                      params.category === cat.slug ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                    }`}
                  >
                    {localized(cat, 'name', locale)}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="bg-surface p-4 rounded-xl border border-border">
              <h3 className="font-semibold mb-3">{t.catalogue.sortBy}</h3>
              <div className="space-y-2">
                {sortOptions.map(opt => {
                  const isActive = currentSort === opt.value
                  return (
                    <Link
                      key={opt.value}
                      href={buildHref(params, { sort: opt.value })}
                      className={`block px-3 py-2 rounded-lg transition-colors ${
                        isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                      }`}
                    >
                      {opt.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="bg-surface p-4 rounded-xl border border-border">
              <h3 className="font-semibold mb-3">{t.catalogue.badgesTitle}</h3>
              <div className="space-y-2">
                {badges.map(badge => {
                  const isActive = currentBadge === badge
                  return (
                    <Link
                      key={badge}
                      href={buildHref(params, { badge: isActive ? undefined : badge })}
                      className={`block px-3 py-2 rounded-lg transition-colors ${
                        isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                      }`}
                    >
                      {t.common.badges[badge]}
                    </Link>
                  )
                })}
              </div>
            </div>
          </aside>

          <section className="flex-1" aria-labelledby="products-heading">
            {products.length === 0 ? (
              <div className="text-center py-16">
                <svg className="w-16 h-16 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-xl font-semibold mb-2">
                  {isEmptyCategoryView ? t.catalogue.comingSoonTitle : t.catalogue.noResultsTitle}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {isEmptyCategoryView ? t.catalogue.comingSoonText : t.catalogue.noResultsText}
                </p>
                <Link href="/catalogue" className="text-primary hover:underline">{t.catalogue.seeFullCatalogue}</Link>
              </div>
            ) : (
              <>
                {params.category ? (
                  productsByCategory.map(({ category, products: catProducts }) => (
                    <ProductRow key={category.id} category={category} products={catProducts} />
                  ))
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products.map((product, index) => (
                      <ProductCard key={product.id} product={product} priority={index === 0} />
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}