export interface CategoryTileConfig {
  slug: string
  name: string
  logo?: string // key from LOGOS in lib/logos.ts
  icon?: React.ReactNode // fallback SVG if no logo
  sort_order: number
}

export const categoryTilesConfig: CategoryTileConfig[] = [
  { slug: 'ia-et-outils', name: 'IA & Outils', logo: 'googlegemini', sort_order: 1 },
  { slug: 'abonnements', name: 'Abonnements', logo: 'openai', sort_order: 2 },
  { slug: 'streaming', name: 'Streaming', logo: 'netflix', sort_order: 3 },
  { slug: 'logiciels', name: 'Logiciels', logo: 'canva', sort_order: 4 },
  { slug: 'cartes-cadeaux', name: 'Cartes Cadeaux', sort_order: 5 },
  { slug: 'steam', name: 'Steam', logo: 'steam', sort_order: 6 },
  { slug: 'playstation', name: 'PlayStation', logo: 'playstation', sort_order: 7 },
  { slug: 'xbox', name: 'Xbox', logo: 'xbox', sort_order: 8 },
  { slug: 'nintendo', name: 'Nintendo', logo: 'nintendo-switch', sort_order: 9 },
  { slug: 'jeux-mobile', name: 'Jeux Mobile', sort_order: 10 },
  { slug: 'musique', name: 'Musique', logo: 'spotify', sort_order: 11 },
]