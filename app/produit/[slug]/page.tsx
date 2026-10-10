import { createClient } from '@/lib/supabase/server'
import { PublicProduct } from '@/types'
import { notFound } from 'next/navigation'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import Link from 'next/link'
import { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('public_products')
    .select('name, short_description, image_url')
    .eq('slug', slug)
    .single()

  if (!product) {
    return {
      title: 'Produit introuvable - EASY-SUB',
    }
  }

  return {
    title: `${product.name} - EASY-SUB`,
    description: product.short_description || `Découvrez ${product.name} sur EASY-SUB`,
    openGraph: {
      title: `${product.name} - EASY-SUB`,
      description: product.short_description || `Découvrez ${product.name} sur EASY-SUB`,
      images: product.image_url ? [{ url: product.image_url }] : [],
      type: 'website',
    },
  }
}

async function getProduct(slug: string): Promise<PublicProduct | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('public_products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }
  return data
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour au catalogue
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {product.image_url ? (
              <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video rounded-xl bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">Pas d'image</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <span className="text-sm font-medium text-primary">
              {product.is_featured && 'PRODUIT VEDETTE • '}{product.duration}
            </span>

            <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>

            {product.short_description && (
              <p className="text-lg text-muted-foreground">{product.short_description}</p>
            )}

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-primary">
                {new Intl.NumberFormat('fr-FR').format(product.sale_price_xof)} FCFA
              </span>
            </div>

            {product.description && (
              <div className="prose prose-invert max-w-none">
                {product.description.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </div>
            )}

            {product.warranty_note && (
              <div className="border-l-4 border-success pl-4 py-2 bg-success/10 rounded-r-lg">
                <p className="text-sm text-success-foreground">
                  <strong>Garantie : </strong>{product.warranty_note}
                </p>
              </div>
            )}

            <div className="pt-4 border-t flex flex-col sm:flex-row gap-4">
              {!product.in_stock ? (
                <div className="flex-1">
                  <span className="inline-block w-full text-center bg-destructive/20 text-destructive px-6 py-4 rounded-lg font-semibold text-lg">
                    Indisponible
                  </span>
                </div>
              ) : (
                <a
                  href={buildWhatsAppLink(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403c-.454-1.805-.777-3.242-.53-3.742.416-.837 1.043-1.642 2.122-2.406.093-.063.155-.14.259-.216.224-.163.613-.159 1.09.036.242.1 1.277 1.194 1.172 1.351-.087.134-1.595 1.988-3.613 2.473-1.937.464-2.492.337-2.492.337" />
                  </svg>
                  Commander sur WhatsApp
                </a>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              Pas de paiement en ligne. Le paiement (Mobile Money / dépôt bancaire) et la livraison se font manuellement sur WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}