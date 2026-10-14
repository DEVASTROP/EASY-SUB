-- Add more categories for G2A-style catalog
-- Run after 001_initial_schema.sql (or schema.sql)

INSERT INTO categories (name, slug, sort_order) VALUES
  ('Abonnements', 'abonnements', 2),
  ('Streaming', 'streaming', 3),
  ('Logiciels', 'logiciels', 4),
  ('Cartes Cadeaux', 'cartes-cadeaux', 5),
  ('Steam', 'steam', 6),
  ('PlayStation', 'playstation', 7),
  ('Xbox', 'xbox', 8),
  ('Nintendo', 'nintendo', 9),
  ('Jeux Mobile', 'jeux-mobile', 10),
  ('Musique', 'musique', 11)
ON CONFLICT (slug) DO NOTHING;