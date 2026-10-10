-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sort_order INT DEFAULT 0
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id),
  short_description TEXT,
  description TEXT,
  duration TEXT NOT NULL,
  image_url TEXT,
  purchase_price_usd NUMERIC(10, 2) NOT NULL DEFAULT 0,
  exchange_rate NUMERIC(10, 2) NOT NULL DEFAULT 600,
  card_fees_percent NUMERIC(5, 2) NOT NULL DEFAULT 3.5,
  sale_price_xof INT NOT NULL DEFAULT 0,
  is_hidden BOOLEAN DEFAULT FALSE,
  in_stock BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  warranty_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Public view - only public columns, only non-hidden products
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
  in_stock,
  is_featured,
  warranty_note,
  created_at,
  updated_at
FROM products
WHERE is_hidden = FALSE;

-- RLS Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER VIEW public_products SET (security_invoker = TRUE); -- Not needed for views but good practice

-- Categories: public read access
CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  USING (TRUE);

-- Products: no direct public access
CREATE POLICY "Products are readable by authenticated users only"
  ON products FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Products can be inserted by authenticated users"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Products can be updated by authenticated users"
  ON products FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Products can be deleted by authenticated users"
  ON products FOR DELETE
  USING (auth.role() = 'authenticated');

-- Public view: public read access (RLS not directly applicable to views in same way)
-- The view filters is_hidden = false and only exposes public columns
GRANT SELECT ON public_products TO anon;
GRANT SELECT ON public_products TO authenticated;
GRANT SELECT ON categories TO anon;
GRANT SELECT ON categories TO authenticated;

-- Seed data
INSERT INTO categories (name, slug, sort_order) VALUES
  ('IA et outils', 'ia-et-outils', 1),
  ('Divertissement', 'divertissement', 2),
  ('Jeux', 'jeux', 3);

-- Sample featured product: Gemini Pro 18 mois
INSERT INTO products (
  name, slug, category_id, short_description, description, duration,
  image_url, purchase_price_usd, exchange_rate, card_fees_percent,
  sale_price_xof, is_featured, in_stock, is_hidden
) VALUES (
  'Gemini Pro',
  'gemini-pro-18-mois',
  (SELECT id FROM categories WHERE slug = 'ia-et-outils'),
  'Accès complet à Gemini Pro pendant 18 mois',
  'Profitez de toutes les fonctionnalités avancées de Google Gemini Pro : modèles de langage les plus performants, fenêtre de contexte étendue, analyse de documents, génération de code, et bien plus.',
  '18 mois',
  NULL,
  20.00,
  600.00,
  3.5,
  15000,
  TRUE,
  TRUE,
  FALSE
);