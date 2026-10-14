'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Category } from '@/types'
import { computeMargin } from '@/lib/margin'
import { LogoutButton } from '../../LogoutButton'
import { ImageUploader } from '../../components/ImageUploader'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

interface ProductFormData {
  name: string
  slug: string
  category_id: string
  short_description: string
  description: string
  duration: string
  image_url: string
  purchase_price_usd: number
  exchange_rate: number
  card_fees_percent: number
  sale_price_xof: number
  original_price_xof: number | null
  badge: 'NOUVEAU' | 'PROMO' | 'HOT' | null
  region_label: string | null
  is_hidden: boolean
  in_stock: boolean
  is_featured: boolean
  warranty_note: string
}

const defaultFormData: ProductFormData = {
  name: '',
  slug: '',
  category_id: '',
  short_description: '',
  description: '',
  duration: '',
  image_url: '',
  purchase_price_usd: 0,
  exchange_rate: 600,
  card_fees_percent: 3.5,
  sale_price_xof: 0,
  original_price_xof: null,
  badge: null,
  region_label: null,
  is_hidden: false,
  in_stock: true,
  is_featured: false,
  warranty_note: '',
}

export default function AdminProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const isNew = productId === 'nouveau'

  const [formData, setFormData] = useState<ProductFormData>(defaultFormData)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [margin, setMargin] = useState({ costXof: 0, marginXof: 0, marginPercent: 0 })
  const slugEditedRef = useRef(false)

  useEffect(() => {
    loadCategories()
    if (!isNew) {
      loadProduct()
    } else {
      setLoading(false)
    }
  }, [isNew])

    useEffect(() => {
    if (isNew && !slugEditedRef.current && formData.name) {
      setFormData(prev => ({ ...prev, slug: slugify(formData.name) }))
    }
  }, [formData.name, isNew])

  useEffect(() => {
    const m = computeMargin({
      ...formData,
      id: '',
      created_at: '',
      updated_at: '',
    } as any)
    setMargin(m)
  }, [formData.purchase_price_usd, formData.exchange_rate, formData.card_fees_percent, formData.sale_price_xof])

  async function loadCategories() {
    const supabase = createClient()
    const { data } = await supabase.from('categories').select('*').order('sort_order')
    if (data) setCategories(data)
  }

  async function loadProduct() {
    const supabase = createClient()
    const { data, error } = await supabase.from('products').select('*').eq('id', productId).single()
    if (error) {
      setError('Produit introuvable')
      setLoading(false)
      return
    }
    if (data) {
      setFormData({
        name: data.name,
        slug: data.slug,
        category_id: data.category_id,
        short_description: data.short_description || '',
        description: data.description || '',
        duration: data.duration,
        image_url: data.image_url || '',
        purchase_price_usd: data.purchase_price_usd,
        exchange_rate: data.exchange_rate,
        card_fees_percent: data.card_fees_percent,
        sale_price_xof: data.sale_price_xof,
        original_price_xof: data.original_price_xof,
        badge: data.badge,
        region_label: data.region_label,
        is_hidden: data.is_hidden,
        in_stock: data.in_stock,
        is_featured: data.is_featured,
        warranty_note: data.warranty_note || '',
      })
    }
    setLoading(false)
  }

  function handleChange<K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const supabase = createClient()

    const payload = {
      ...formData,
      purchase_price_usd: Number(formData.purchase_price_usd),
      exchange_rate: Number(formData.exchange_rate),
      card_fees_percent: Number(formData.card_fees_percent),
      sale_price_xof: Number(formData.sale_price_xof),
    }

    let result
    if (isNew) {
      result = await supabase.from('products').insert(payload).select().single()
    } else {
      result = await supabase.from('products').update(payload).eq('id', productId).select().single()
    }

    if (result.error) {
      setError('Erreur lors de l\'enregistrement, réessayez.')
      setSaving(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <a href="/admin" className="text-muted-foreground hover:text-foreground mb-4 inline-block">
              ← Retour à la liste
            </a>
            <h1 className="text-3xl font-bold">{isNew ? 'Nouveau produit' : 'Modifier le produit'}</h1>
          </div>
          <LogoutButton />
        </div>

        {error && (
          <div className="mb-6 bg-destructive/20 text-destructive p-4 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Nom *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={e => {
                  handleChange('slug', e.target.value)
                  slugEditedRef.current = true
                }}
                required
                className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Catégorie *</label>
              <select
                value={formData.category_id}
                onChange={e => handleChange('category_id', e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Sélectionner...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Durée *</label>
              <input
                type="text"
                value={formData.duration}
                onChange={e => handleChange('duration', e.target.value)}
                required
                placeholder="ex: 18 mois"
                className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description courte</label>
              <textarea
                value={formData.short_description}
                onChange={e => handleChange('short_description', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description complète</label>
              <textarea
                value={formData.description}
                onChange={e => handleChange('description', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Prix et marge</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Prix d'achat (USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.purchase_price_usd}
                  onChange={e => handleChange('purchase_price_usd', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Taux de change (XOF/USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.exchange_rate}
                  onChange={e => handleChange('exchange_rate', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Frais carte (%) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.card_fees_percent}
                  onChange={e => handleChange('card_fees_percent', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Prix de vente (FCFA) *</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={formData.sale_price_xof}
                  onChange={e => handleChange('sale_price_xof', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="mt-4 grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Coût estimé</div>
                <div className="text-2xl font-bold text-foreground">
                  {new Intl.NumberFormat('fr-FR').format(margin.costXof)} FCFA
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Marge</div>
                <div className="text-2xl font-bold text-success">
                  {new Intl.NumberFormat('fr-FR').format(margin.marginXof)} FCFA
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Marge %</div>
                <div className="text-2xl font-bold text-success">
                  {margin.marginPercent.toFixed(1)}%
                </div>
              </div>
            </div>

            {formData.original_price_xof && formData.original_price_xof > formData.sale_price_xof && (
              <div className="mt-4 p-4 bg-warning/10 border border-warning/30 rounded-lg">
                <div className="text-sm text-warning-foreground">
                  Réduction affichée : <strong>{Math.round((formData.original_price_xof - formData.sale_price_xof) / formData.original_price_xof * 100)}%</strong>
                </div>
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Promotion et étiquettes</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Prix de référence (FCFA)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={formData.original_price_xof || ''}
                  onChange={e => handleChange('original_price_xof', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Étiquette</label>
                <select
                  value={formData.badge || ''}
                  onChange={e => handleChange('badge', (e.target.value as 'NOUVEAU' | 'PROMO' | 'HOT') || null)}
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Aucune</option>
                  <option value="NOUVEAU">NOUVEAU</option>
                  <option value="PROMO">PROMO</option>
                  <option value="HOT">HOT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Région</label>
                <input
                  type="text"
                  value={formData.region_label || ''}
                  onChange={e => handleChange('region_label', e.target.value || null)}
                  placeholder="ex: GLOBAL, AFRIQUE"
                  className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Image du produit</label>
              <ImageUploader
                value={formData.image_url}
                onChange={(url) => handleChange('image_url', url)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Note de garantie</label>
              <textarea
                value={formData.warranty_note}
                onChange={e => handleChange('warranty_note', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_hidden}
                  onChange={e => handleChange('is_hidden', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">Masquer ce produit (ne sera pas visible publiquement)</span>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.in_stock}
                  onChange={e => handleChange('in_stock', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">En stock</span>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={e => handleChange('is_featured', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">Produit vedette (affiché en haut de la page d'accueil)</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : isNew ? 'Créer' : 'Enregistrer'}
            </button>
            <a
              href="/admin"
              className="px-8 py-3 rounded-lg font-medium border hover:bg-muted transition-colors"
            >
              Annuler
            </a>
          </div>
        </form>
      </div>
    </main>
  )
}