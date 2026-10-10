export interface BrandLogoConfig {
  name: string
  color: string
  isMulticolor: boolean
  keywords: string[]
}

export const LOGOS: BrandLogoConfig[] = [
  {
    name: 'whatsapp',
    color: '#25D366',
    isMulticolor: false,
    keywords: ['whatsapp', 'wa.me'],
  },
  {
    name: 'canva',
    color: '#00C4CC',
    isMulticolor: true,
    keywords: ['canva'],
  },
  {
    name: 'netflix',
    color: '#E50914',
    isMulticolor: false,
    keywords: ['netflix'],
  },
  {
    name: 'chatgpt',
    color: '#10A37F',
    isMulticolor: false,
    keywords: ['chatgpt', 'openai', 'gpt'],
  },
  {
    name: 'gemini',
    color: '#4285F4',
    isMulticolor: false,
    keywords: ['gemini', 'google ai', 'bard'],
  },
  {
    name: 'youtube',
    color: '#FF0000',
    isMulticolor: false,
    keywords: ['youtube', 'youtube premium'],
  },
  {
    name: 'spotify',
    color: '#1DB954',
    isMulticolor: false,
    keywords: ['spotify'],
  },
  {
    name: 'disney',
    color: '#113CCF',
    isMulticolor: false,
    keywords: ['disney', 'disney+', 'disney plus'],
  },
  {
    name: 'apple',
    color: '#000000',
    isMulticolor: false,
    keywords: ['apple', 'apple tv', 'apple music', 'icloud'],
  },
  {
    name: 'microsoft',
    color: '#0078D4',
    isMulticolor: false,
    keywords: ['microsoft', 'office 365', 'xbox', 'game pass'],
  },
  {
    name: 'adobe',
    color: '#FF0000',
    isMulticolor: false,
    keywords: ['adobe', 'photoshop', 'illustrator', 'premiere', 'creative cloud'],
  },
  {
    name: 'github',
    color: '#181717',
    isMulticolor: false,
    keywords: ['github', 'copilot'],
  },
  {
    name: 'notion',
    color: '#000000',
    isMulticolor: false,
    keywords: ['notion'],
  },
  {
    name: 'figma',
    color: '#F24E1E',
    isMulticolor: false,
    keywords: ['figma'],
  },
  {
    name: 'vercel',
    color: '#000000',
    isMulticolor: false,
    keywords: ['vercel'],
  },
  {
    name: 'supabase',
    color: '#3ECF8E',
    isMulticolor: false,
    keywords: ['supabase'],
  },
]

export function brandLogoFor(productName: string): BrandLogoConfig | null {
  const lower = productName.toLowerCase()
  for (const logo of LOGOS) {
    for (const keyword of logo.keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        return logo
      }
    }
  }
  return null
}