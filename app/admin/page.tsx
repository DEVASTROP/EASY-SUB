import { createClient } from '@/lib/supabase/server'
import { Product } from '@/types'
import { computeMargin } from '@/lib/margin'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { LogoutButton } from './LogoutButton'
import { DeleteProductButton } from './components/DeleteProductButton'

async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }
  return data || []
}

async function _toggleHidden(productId: string, isHidden: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('products')
    .update({ is_hidden: isHidden })
    .eq('id', productId)

  if (error) {
    console.error('Error toggling hidden:', error)
    return false
  }
  revalidatePath('/admin')
  return true
}

export default async function AdminPage() {
  const products = await getProducts()

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Administration - Produits</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/produits/nouveau"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Nouveau produit
            </Link>
            <LogoutButton />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b">
                <th className="pb-3 font-medium">Produit</th>
                <th className="pb-3 font-medium">Catégorie</th>
                <th className="pb-3 font-medium text-right">Prix vente</th>
                <th className="pb-3 font-medium text-right">Coût (FCFA)</th>
                <th className="pb-3 font-medium text-right">Marge (FCFA)</th>
                <th className="pb-3 font-medium text-right">Marge %</th>
                <th className="pb-3 font-medium text-center">Stock</th>
                <th className="pb-3 font-medium text-center">Vedette</th>
                <th className="pb-3 font-medium text-center">Visible</th>
                <th className="pb-3 font-medium text-center">Stock</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map(product => {
                const margin = computeMargin(product)
                const marginColor = margin.marginXof < 0 ? 'text-destructive' : margin.marginXof === 0 ? 'text-warning' : 'text-success'
                const marginPercentColor = margin.marginPercent < 0 ? 'text-destructive' : margin.marginPercent === 0 ? 'text-warning' : 'text-success'
                return (
                  <tr key={product.id} className={product.is_hidden ? 'opacity-50 bg-muted/30' : ''}>
                    <td className="py-4">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.slug}</div>
                    </td>
                    <td className="py-4 text-muted-foreground">{product.category_id}</td>
                    <td className="py-4 text-right font-medium">
                      {new Intl.NumberFormat('fr-FR').format(product.sale_price_xof)} FCFA
                    </td>
                    <td className="py-4 text-right text-muted-foreground">
                      {new Intl.NumberFormat('fr-FR').format(margin.costXof)} FCFA
                    </td>
                    <td className="py-4 text-right font-medium">
                      <span className={marginColor}>
                        {new Intl.NumberFormat('fr-FR').format(margin.marginXof)} FCFA
                      </span>
                    </td>
                    <td className="py-4 text-right font-medium">
                      <span className={marginPercentColor}>
                        {margin.marginPercent.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      {product.in_stock ? (
                        <span className="inline-block px-2 py-1 text-xs bg-success/20 text-success rounded-full">
                          En stock
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs bg-destructive/20 text-destructive rounded-full">
                          Rupture
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-center">
                      {product.is_featured ? (
                        <span className="inline-block px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                          Oui
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">Non</span>
                      )}
                    </td>
                    <td className="py-4 text-center">
                      <form action={`/admin/toggle-hidden/${product.id}`} method="POST">
                        <input type="hidden" name="is_hidden" value={(!product.is_hidden).toString()} />
                        <button
                          type="submit"
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                            product.is_hidden
                              ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                              : 'bg-success/20 text-success hover:bg-success/30'
                          }`}
                        >
                          {product.is_hidden ? (
                            <>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Afficher
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>
                              Masquer
                            </>
                          )}
                        </button>
                      </form>
                    </td>
                    <td className="py-4 text-center">
                      <form action={`/admin/toggle-stock/${product.id}`} method="POST">
                        <input type="hidden" name="in_stock" value={(!product.in_stock).toString()} />
                        <button
                          type="submit"
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                            product.in_stock
                              ? 'bg-success/20 text-success hover:bg-success/30'
                              : 'bg-destructive/20 text-destructive hover:bg-destructive/30'
                          }`}
                        >
                          {product.in_stock ? (
                            <>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Rupture
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              En stock
                            </>
                          )}
                        </button>
                      </form>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/admin/produits/${product.id}`}
                          className="text-primary hover:underline text-sm"
                        >
                          Modifier
                        </a>
                        <DeleteProductButton productId={product.id} productName={product.name} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Aucun produit pour le moment.</p>
            <Link href="/admin/produits/nouveau" className="text-primary hover:underline mt-4 inline-block">
              Créer le premier produit
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}