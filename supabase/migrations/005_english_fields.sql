-- Migration 005: English versions of product texts and category names
-- Run this manually in the Supabase SQL Editor (after 002, 003 and 004).

-- 1. New optional columns
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS name_en TEXT,
  ADD COLUMN IF NOT EXISTS short_description_en TEXT,
  ADD COLUMN IF NOT EXISTS description_en TEXT,
  ADD COLUMN IF NOT EXISTS warranty_note_en TEXT;

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS name_en TEXT;

-- 2. Recreate the public view with the new public columns.
-- Private columns (purchase_price_usd, exchange_rate, card_fees_percent) are NEVER exposed.
DROP VIEW IF EXISTS public_products;

CREATE VIEW public_products AS
SELECT
  id,
  name,
  name_en,
  slug,
  category_id,
  short_description,
  short_description_en,
  description,
  description_en,
  duration,
  image_url,
  sale_price_xof,
  original_price_xof,
  badge,
  region_label,
  in_stock,
  is_featured,
  warranty_note,
  warranty_note_en,
  created_at,
  updated_at
FROM products
WHERE is_hidden = FALSE;

GRANT SELECT ON public_products TO anon;
GRANT SELECT ON public_products TO authenticated;

-- 3. English names for the known categories (only where still empty)
UPDATE categories SET name_en = v.name_en
FROM (VALUES
  ('ia-et-outils', 'AI & Tools'),
  ('divertissement', 'Entertainment'),
  ('jeux', 'Games'),
  ('ia', 'AI'),
  ('abonnements', 'Subscriptions'),
  ('streaming', 'Streaming'),
  ('logiciels', 'Software'),
  ('cartes-cadeaux', 'Gift Cards'),
  ('steam', 'Steam'),
  ('playstation', 'PlayStation'),
  ('xbox', 'Xbox'),
  ('nintendo', 'Nintendo'),
  ('jeux-mobile', 'Mobile Games'),
  ('musique', 'Music')
) AS v(slug, name_en)
WHERE categories.slug = v.slug AND (categories.name_en IS NULL OR categories.name_en = '');
