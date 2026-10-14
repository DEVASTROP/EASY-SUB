'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { LogoIcon } from './LogoIcon'
import { CategoryDropdown } from './CategoryDropdown'

interface Category {
  id: string
  name: string
  slug: string
  sort_order: number
}

export function Header() {
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    async function loadCategories() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })
      if (data) setCategories(data)
    }
    loadCategories()
  }, [])

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setSelectedCategory(cat)
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set('q', searchQuery.trim())
    if (selectedCategory) params.set('category', selectedCategory)
    const qs = params.toString()
    window.location.href = qs ? `/catalogue?${qs}` : '/catalogue'
  }

  return (
    <header
      className="sticky top-0 z-50 bg-header text-header-foreground shadow-lg"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Row 1: Logo + WhatsApp (mobile) or Logo + Search + WhatsApp (desktop) */}
        <div className="flex items-center justify-between h-16 md:h-16 gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-primary hover:opacity-80 transition-opacity flex-shrink-0"
            aria-label="EASY-SUB - Accueil"
          >
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="currentColor" />
              <path
                d="M8 16L14 22L24 10"
                stroke="hsl(var(--color-header-foreground))"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="hidden sm:block">EASY-SUB</span>
          </Link>

          {/* Search bar - middle on desktop, full width row 2 on mobile */}
          <div className={`flex-1 max-w-2xl md:max-w-3xl ${isMobile ? 'hidden' : ''}`}>
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative flex items-center bg-white rounded-full h-11 px-3 shadow-sm">
                <label htmlFor="search" className="sr-only">Rechercher</label>
                <Search className="w-5 h-5 text-muted-foreground ml-2 flex-shrink-0" aria-hidden="true" />
                <input
                  id="search"
                  type="text"
                  enterKeyHint="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Que cherchez-vous ?"
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground py-2 px-3 text-sm md:text-base min-w-0"
                />
                <div className="w-px h-6 bg-border mx-2 flex-shrink-0" aria-hidden="true" />
                <CategoryDropdown
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelect={setSelectedCategory}
                />
                <button
                  type="submit"
                  className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity ml-2"
                  aria-label="Rechercher"
                >
                  <Search className="w-5 h-5 text-white" aria-hidden="true" />
                </button>
              </div>
            </form>
          </div>

          {/* WhatsApp button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent('Bonjour, j\'ai une question.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`bg-whatsapp text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 ${isMobile ? 'p-2' : 'px-4 py-2'}`}
              aria-label="Nous contacter sur WhatsApp"
            >
              <LogoIcon name="whatsapp" tone="mono" size={isMobile ? 24 : 20} />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Row 2: Search bar on mobile only */}
        {isMobile && (
          <div className="pb-4">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative flex items-center bg-white rounded-full h-11 px-3 shadow-sm">
                <label htmlFor="mobile-search" className="sr-only">Rechercher</label>
                <Search className="w-5 h-5 text-muted-foreground ml-2 flex-shrink-0" aria-hidden="true" />
                <input
                  id="mobile-search"
                  type="text"
                  enterKeyHint="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Que cherchez-vous ?"
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground py-2 px-3 text-sm min-w-0"
                />
                <div className="w-px h-6 bg-border mx-2 flex-shrink-0" aria-hidden="true" />
                <CategoryDropdown
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelect={setSelectedCategory}
                />
                <button
                  type="submit"
                  className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity ml-2"
                  aria-label="Rechercher"
                >
                  <Search className="w-5 h-5 text-white" aria-hidden="true" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  )
}