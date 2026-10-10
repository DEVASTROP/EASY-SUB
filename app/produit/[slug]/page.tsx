import { createClient } from '@/lib/supabase/server'
import { PublicProduct } from '@/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { WhatsAppOrderButton } from '@/app/components/WhatsAppOrderButton'

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
    <div className="min-h-screen p-4 md:p-8">
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
              <div className="aspect-video rounded-xl overflow-hidden bg-muted relative">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
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
                <p className="text-sm text-success">
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
                <WhatsAppOrderButton product={product} />
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              Pas de paiement en ligne. Le paiement (Mobile Money / dépôt bancaire) et la livraison se font manuellement sur WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}