-- Migration 002: Add original_price_xof, badge, region_label to products and update public_products view
-- Run this manually in Supabase SQL Editor

-- Add new columns to products table
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS original_price_xof INTEGER,
  ADD COLUMN IF NOT EXISTS badge TEXT CHECK (badge IN ('NOUVEAU', 'PROMO', 'HOT')),
  ADD COLUMN IF NOT EXISTS region_label TEXT;

-- Drop and recreate public_products view with new columns
DROP VIEW IF EXISTS public_products;

CREATE VIEW public_products AS
SELECT
  id,
  name,
  slug,
  category_id,
  short_description,
  description,
  duration,
  image_url,
  sale_price_xof,
  original_price_xof,
  badge,
  region_label,
  in_stock,
  is_featured,
  warranty_note,
  created_at,
  updated_at
FROM products
WHERE is_hidden = FALSE;

-- RLS and grants remain the same (already applied in schema.sql)
GRANT SELECT ON public_products TO anon;
GRANT SELECT ON public_products TO authenticated;