import { createClient } from '@/lib/supabase/server'
import { PublicProduct, Category } from '@/types'
import { HeroSection } from './components/HeroSection'
import { PromoStrip } from './components/PromoStrip'
import { CategoryTiles } from './components/CategoryTiles'
import { ProductRow } from './components/ProductRow'
import { TrustBar } from './components/TrustBar'
import { HowItWorks } from './components/HowItWorks'

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

async function getPublicProducts(): Promise<PublicProduct[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('public_products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }
  return data || []
}

async function getPromoProducts(): Promise<PublicProduct[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('public_products')
    .select('*')
    .in('badge', ['NOUVEAU', 'PROMO', 'HOT'])
    .eq('in_stock', true)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Error fetching promo products:', error)
    return []
  }
  return data || []
}

export default async function HomePage() {
  const [categories, products, promoProducts] = await Promise.all([
    getCategories(),
    getPublicProducts(),
    getPromoProducts(),
  ])

  const productsByCategory = categories.map(category => ({
    category,
    products: products.filter(p => p.category_id === category.id && p.in_stock),
  })).filter(({ products }) => products.length > 0)

  return (
    <div className="min-h-screen">
      <HeroSection />
      {promoProducts.length > 0 && <PromoStrip promoProducts={promoProducts} />}
      {categories.length > 0 && <CategoryTiles categories={categories} products={products} />}
      {productsByCategory.length > 0 && (
        <section className="py-16 md:py-24 bg-card" aria-labelledby="products-title">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            {productsByCategory.map(({ category, products: catProducts }) => (
              <ProductRow key={category.id} category={category} products={catProducts} />
            ))}
          </div>
        </section>
      )}
      <TrustBar />
      <HowItWorks />
    </div>
  )
}