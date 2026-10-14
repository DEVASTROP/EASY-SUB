import { Brain, Tv, AppWindow, Gift, Repeat, Smartphone, Music } from 'lucide-react'

export interface CategoryTileConfig {
  slug: string
  name: string
  logo?: string // key from LOGOS in lib/logos.ts (for platform tiles only)
  icon?: React.ReactNode // fallback lucide icon
  sort_order: number
  enabled: boolean
}

export const categoryTilesConfig: CategoryTileConfig[] = [
  // Enabled tiles (8 tiles)
  { slug: 'ia-et-outils', name: 'IA & OUTILS', icon: <Brain className="w-5 h-5" />, sort_order: 1, enabled: true },
  { slug: 'streaming', name: 'STREAMING', icon: <Tv className="w-5 h-5" />, sort_order: 2, enabled: true },
  { slug: 'logiciels', name: 'LOGICIELS', icon: <AppWindow className="w-5 h-5" />, sort_order: 3, enabled: true },
  { slug: 'cartes-cadeaux', name: 'CARTES CADEAUX', icon: <Gift className="w-5 h-5" />, sort_order: 4, enabled: true },
  { slug: 'steam', name: 'STEAM', logo: 'steam', sort_order: 5, enabled: true },
  { slug: 'playstation', name: 'PLAYSTATION', logo: 'playstation', sort_order: 6, enabled: true },
  { slug: 'xbox', name: 'XBOX', logo: 'xbox', sort_order: 7, enabled: true },
  { slug: 'nintendo', name: 'NINTENDO', logo: 'nintendo-switch', sort_order: 8, enabled: true },
  // Disabled tiles (kept for future enable)
  { slug: 'abonnements', name: 'ABONNEMENTS', icon: <Repeat className="w-5 h-5" />, sort_order: 9, enabled: false },
  { slug: 'jeux-mobile', name: 'JEUX MOBILE', icon: <Smartphone className="w-5 h-5" />, sort_order: 10, enabled: false },
  { slug: 'musique', name: 'MUSIQUE', icon: <Music className="w-5 h-5" />, sort_order: 11, enabled: false },
]