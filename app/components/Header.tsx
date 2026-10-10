'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Search, Menu, X } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { LogoIcon } from './LogoIcon'

interface Category {
  id: string
  name: string
  slug: string
  sort_order: number
}

export function Header() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [scrolled, setScrolled] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/catalogue?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 bg-header text-header-foreground ${
        scrolled ? 'shadow-lg' : ''
      }`}
      role="banner"
    >
      {/* Top bar: logo, search, WhatsApp */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-primary hover:opacity-80 transition-opacity"
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

          {/* WhatsApp button + mobile menu button */}
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent('Bonjour, j\'ai une question.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 bg-whatsapp text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
              aria-label="Nous contacter sur WhatsApp"
            >
              <LogoIcon name="whatsapp" tone="mono" size={20} />
              <span>WhatsApp</span>
            </a>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-accent text-header-foreground"
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile search row - visible on mobile */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <label htmlFor="mobile-search" className="sr-only">Rechercher</label>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
              <input
                id="mobile-search"
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher un abonnement, un jeu..."
                className="w-full bg-surface border border-border rounded-lg px-10 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Rechercher
            </button>
          </form>
        </div>
      </div>

      {/* Category nav bar - collapsible on mobile */}
      <div className="bg-header border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <nav className={`flex gap-2 overflow-x-auto scrollbar-hide pb-2 ${mobileMenuOpen ? '' : 'md:hidden hidden'} `} aria-label="Catégories" role="navigation">
            <Link
              href="/catalogue"
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                pathname === '/catalogue' && !searchParams.get('category')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-header-foreground/70 hover:bg-white/10'
              }`}
            >
              Toutes les offres
            </Link>
            {categories.map(category => (
              <Link
                key={category.id}
                href={`/catalogue?category=${category.slug}`}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  searchParams.get('category') === category.slug
                    ? 'bg-primary text-primary-foreground'
                    : 'text-header-foreground/70 hover:bg-white/10'
                }`}
              >
                {category.slug === 'ia-et-outils' && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
                {category.slug === 'divertissement' && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
                {category.slug === 'jeux' && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                )}
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop search form - hidden on mobile */}
      <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 max-w-xl mx-auto px-4 md:px-6 py-4">
        <label htmlFor="search" className="sr-only">Rechercher</label>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
          <input
            id="search"
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher un abonnement, un jeu..."
            className="w-full bg-surface border border-border rounded-lg px-10 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Rechercher
        </button>
      </form>
    </header>
  )
}