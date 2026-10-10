import { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PublicProduct, Category } from '@/types'
import { ProductCard } from '../components/ProductCard'
import { ProductRow } from '../components/ProductRow'

interface SearchParams {
  q?: string
  category?: string
  sort?: 'price-asc' | 'price-desc' | 'newest'
  badge?: string
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
  let query = supabase.from('public_products').select('*').eq('in_stock', true)

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

  switch (searchParams.sort) {
    case 'price-asc':
      query = query.order('sale_price_xof', { ascending: true })
      break
    case 'price-desc':
      query = query.order('sale_price_xof', { ascending: false })
      break
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false })
      break
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }
  return data || []
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchParams> }): Promise<Metadata> {
  const params = await searchParams
  const categorySlug = params.category
  let title = 'Catalogue - EASY-SUB'

  if (categorySlug) {
    const supabase = await createClient()
    const { data: cat } = await supabase
      .from('categories')
      .select('name')
      .eq('slug', categorySlug)
      .single()
    if (cat) title = `${cat.name} - EASY-SUB`
  } else if (params.q) {
    title = `Recherche: ${params.q} - EASY-SUB`
  }

  return {
    title,
    description: 'Catalogue complet d\'abonnements numériques et crédits de jeu. Filtrez par catégorie, prix, nouveautés.',
    openGraph: {
      title,
      description: 'Catalogue complet d\'abonnements numériques et crédits de jeu.',
      type: 'website',
    },
  }
}

export default async function CataloguePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const [categories, products] = await Promise.all([
    getCategories(),
    getFilteredProducts(params),
  ])

  const productsByCategory = categories.map(category => ({
    category,
    products: products.filter(p => p.category_id === category.id),
  })).filter(({ products }) => products.length > 0)

  const activeCategory = categories.find(c => c.slug === params.category)

  return (
    <main className="min-h-screen bg-background pt-32 md:pt-40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {activeCategory ? activeCategory.name : 'Catalogue complet'}
          </h1>
          <p className="text-muted-foreground">
            {products.length} offre{products.length > 1 ? 's' : ''} trouvée{products.length > 1 ? 's' : ''}
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-surface p-4 rounded-xl border border-border">
              <h3 className="font-semibold mb-3">Catégories</h3>
              <nav className="space-y-2" aria-label="Filtrer par catégorie">
                <Link
                  href="/catalogue"
                  className={`block px-3 py-2 rounded-lg transition-colors ${
                    !params.category ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                  }`}
                >
                  Tout voir
                </Link>
                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    href={`/catalogue?category=${cat.slug}`}
                    className={`block px-3 py-2 rounded-lg transition-colors ${
                      params.category === cat.slug ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="bg-surface p-4 rounded-xl border border-border">
              <h3 className="font-semibold mb-3">Trier par</h3>
              <div className="space-y-2">
                {[
                  { value: 'newest', label: 'Plus récents' },
                  { value: 'price-asc', label: 'Prix croissant' },
                  { value: 'price-desc', label: 'Prix décroissant' },
                ].map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      value={opt.value}
                      checked={params.sort === opt.value || (!params.sort && opt.value === 'newest')}
                      onChange={() => {
                        const url = new URL(window.location.href)
                        url.searchParams.set('sort', opt.value)
                        window.location.href = url.toString()
                      }}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-surface p-4 rounded-xl border border-border">
              <h3 className="font-semibold mb-3">Badges</h3>
              <div className="space-y-2">
                {['NOUVEAU', 'PROMO', 'HOT'].map(badge => (
                  <label key={badge} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={params.badge === badge}
                      onChange={(e) => {
                        const url = new URL(window.location.href)
                        if (e.target.checked) {
                          url.searchParams.set('badge', badge)
                        } else {
                          url.searchParams.delete('badge')
                        }
                        window.location.href = url.toString()
                      }}
                      className="text-primary focus:ring-primary rounded"
                    />
                    <span className="text-sm capitalize">{badge.toLowerCase()}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <section className="flex-1" aria-labelledby="products-heading">
            {products.length === 0 ? (
              <div className="text-center py-16">
                <svg className="w-16 h-16 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-xl font-semibold mb-2">Aucun produit trouvé</h2>
                <p className="text-muted-foreground mb-4">Essaie de modifier tes filtres ou ta recherche</p>
                <a href="/catalogue" className="text-primary hover:underline">Voir tout le catalogue</a>
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
    </main>
  )
}