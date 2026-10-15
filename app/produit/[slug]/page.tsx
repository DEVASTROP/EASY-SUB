import { createClient } from '@/lib/supabase/server'
import { PublicProduct } from '@/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { WhatsAppOrderButton } from '@/app/components/WhatsAppOrderButton'
import { getServerI18n } from '@/lib/i18n/server'
import { fill, formatDuration, formatPrice, localized } from '@/lib/i18n/format'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { locale, t } = await getServerI18n()
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('public_products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!product) {
    return {
      title: `${t.product.notFoundTitle} - EASY-SUB`,
    }
  }

  const name = localized(product, 'name', locale)
  const description = localized(product, 'short_description', locale) || fill(t.product.discover, { name })

  return {
    title: `${name} - EASY-SUB`,
    description,
    openGraph: {
      title: `${name} - EASY-SUB`,
      description,
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
  const { locale, t } = await getServerI18n()
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const name = localized(product, 'name', locale)
  const shortDescription = localized(product, 'short_description', locale)
  const description = localized(product, 'description', locale)
  const warrantyNote = localized(product, 'warranty_note', locale)

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
          {t.product.back}
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {product.image_url ? (
              <div className="aspect-square rounded-xl overflow-hidden bg-muted relative">
                <Image
                  src={product.image_url}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            ) : (
              <div className="aspect-square rounded-xl bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">{t.product.noImage}</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <span className="text-sm font-medium text-primary">
              {product.is_featured && `${t.product.featured} • `}{formatDuration(product.duration, locale)}
            </span>

            <h1 className="text-3xl md:text-4xl font-bold">{name}</h1>

            {shortDescription && (
              <p className="text-lg text-muted-foreground">{shortDescription}</p>
            )}

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-primary">
                {product.sale_price_xof > 0 ? formatPrice(product.sale_price_xof, locale) : t.common.priceOnRequest}
              </span>
            </div>

            {description && (
              <div className="prose prose-invert max-w-none">
                {description.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </div>
            )}

            {warrantyNote && (
              <div className="border-l-4 border-success pl-4 py-2 bg-success/10 rounded-r-lg">
                <p className="text-sm text-success">
                  <strong>{t.product.warranty}</strong>{warrantyNote}
                </p>
              </div>
            )}

            <div className="pt-4 border-t flex flex-col sm:flex-row gap-4">
              {!product.in_stock ? (
                <div className="flex-1">
                  <span className="inline-block w-full text-center bg-destructive/20 text-destructive px-6 py-4 rounded-lg font-semibold text-lg">
                    {t.common.unavailable}
                  </span>
                </div>
              ) : (
                <WhatsAppOrderButton product={product} />
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              {t.product.manualPayment}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}