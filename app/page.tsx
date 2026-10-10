import { createClient } from '@/lib/supabase/server'
import { PublicProduct, Category } from '@/types'
import Link from 'next/link'
import { buildWhatsAppLink } from '@/lib/whatsapp'

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

async function getFeaturedProduct(): Promise<PublicProduct | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('public_products')
    .select('*')
    .eq('is_featured', true)
    .eq('in_stock', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching featured product:', error)
    return null
  }
  return data
}

export default async function HomePage() {
  const [categories, products, featuredProduct] = await Promise.all([
    getCategories(),
    getPublicProducts(),
    getFeaturedProduct(),
  ])

  const productsByCategory = categories.map(category => ({
    category,
    products: products.filter(p => p.category_id === category.id),
  }))

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">EASY-SUB</h1>
          <p className="text-muted-foreground text-lg">
            Abonnements numériques et crédits de jeu pour étudiants au Togo
          </p>
        </header>

        {featuredProduct && (
          <section className="border rounded-xl p-6 md:p-8 bg-muted/50">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <span className="text-sm font-medium text-primary mb-2 block">
                  PRODUIT VEDETTE
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {featuredProduct.name}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {featuredProduct.short_description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <span className="text-3xl font-bold text-primary">
                    {new Intl.NumberFormat('fr-FR').format(featuredProduct.sale_price_xof)} FCFA
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {featuredProduct.duration}
                  </span>
                  <a
                    href={buildWhatsAppLink(featuredProduct)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403c-.454-1.805-.777-3.242-.53-3.742.416-.837 1.043-1.642 2.122-2.406.093-.063.155-.14.259-.216.224-.163.613-.159 1.09.036.242.1 1.277 1.194 1.172 1.351-.087.134-1.595 1.988-3.613 2.473-1.937.464-2.492.337-2.492.337" />
                    </svg>
                    Commander sur WhatsApp
                  </a>
                </div>
              </div>
              {featuredProduct.image_url && (
                <div className="w-full md:w-64 h-64 md:h-64">
                  <img
                    src={featuredProduct.image_url}
                    alt={featuredProduct.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </section>
        )}

        <section>
          {productsByCategory.map(({ category, products: catProducts }) => (
            catProducts.length > 0 && (
              <div key={category.id}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-8 h-1 bg-primary"></span>
                  {category.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catProducts.map(product => (
                    <Link
                      key={product.id}
                      href={`/produit/${product.slug}`}
                      className="group border rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-background"
                    >
                      {product.image_url && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {product.short_description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary">
                            {new Intl.NumberFormat('fr-FR').format(product.sale_price_xof)} FCFA
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {product.duration}
                          </span>
                        </div>
                        {!product.in_stock && (
                          <span className="mt-2 inline-block text-sm text-destructive">
                            Indisponible
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          ))}
        </section>

        <section className="bg-muted/30 rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Comment ça marche</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold mb-2">Choisis ton offre</h3>
              <p className="text-sm text-muted-foreground">Parcours nos abonnements et crédits de jeu</p>
            </div>
            <div className="p-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold mb-2">Paie par Mobile Money ou dépôt bancaire sur WhatsApp</h3>
              <p className="text-sm text-muted-foreground">Contacte-nous, on t'envoie les infos de paiement</p>
            </div>
            <div className="p-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold mb-2">Reçois ton produit sur WhatsApp</h3>
              <p className="text-sm text-muted-foreground">Livraison rapide après confirmation du paiement</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}