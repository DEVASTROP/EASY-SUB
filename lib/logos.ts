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
    name: 'openai',
    color: '#10A37F',
    isMulticolor: false,
    keywords: ['openai', 'chatgpt', 'gpt'],
  },
  {
    name: 'googlegemini',
    color: '#4285F4',
    isMulticolor: false,
    keywords: ['gemini', 'google ai', 'bard', 'googlegemini'],
  },
  {
    name: 'spotify',
    color: '#1DB954',
    isMulticolor: false,
    keywords: ['spotify'],
  },
  {
    name: 'steam',
    color: '#1B2838',
    isMulticolor: false,
    keywords: ['steam', 'valve'],
  },
  {
    name: 'playstation',
    color: '#003791',
    isMulticolor: false,
    keywords: ['playstation', 'psn', 'ps5', 'ps4'],
  },
  {
    name: 'xbox',
    color: '#107C10',
    isMulticolor: false,
    keywords: ['xbox', 'game pass'],
  },
  {
    name: 'nintendo-switch',
    color: '#E60012',
    isMulticolor: false,
    keywords: ['nintendo', 'switch', 'eshop', 'nintendo-switch'],
  },
  {
    name: 'anthropic',
    color: '#D97757',
    isMulticolor: false,
    keywords: ['anthropic', 'claude'],
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