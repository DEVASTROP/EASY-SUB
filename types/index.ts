export interface Category {
  id: string
  name: string
  slug: string
  sort_order: number
}

export interface Product {
  id: string
  name: string
  slug: string
  category_id: string
  short_description: string | null
  description: string | null
  duration: string
  image_url: string | null
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
  warranty_note: string | null
  created_at: string
  updated_at: string
}

export interface PublicProduct {
  id: string
  name: string
  slug: string
  category_id: string
  short_description: string | null
  description: string | null
  duration: string
  image_url: string | null
  sale_price_xof: number
  original_price_xof: number | null
  badge: 'NOUVEAU' | 'PROMO' | 'HOT' | null
  region_label: string | null
  in_stock: boolean
  is_featured: boolean
  warranty_note: string | null
  created_at: string
  updated_at: string
}