'use client'

import Link from 'next/link'
import { useRef, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { categoryTilesConfig } from './categoryTiles.config'
import { LogoIcon } from './LogoIcon'
import { brandLogoFor } from '@/lib/logos'
import { cn } from '@/lib/utils'

export function CategoryTiles() {
  const [enabledTiles] = useState(() => categoryTilesConfig.filter(t => t.enabled))
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setShowLeftArrow(el.scrollLeft > 10)
    setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 10)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    checkScroll()
    const ro = new ResizeObserver(checkScroll)
    ro.observe(el)
    el.addEventListener('scroll', checkScroll, { passive: true })
    return () => {
      ro.disconnect()
      el.removeEventListener('scroll', checkScroll)
    }
  }, [])

  const scrollLeft = () => {
    const el = scrollRef.current
    if (el) {
      el.scrollBy({ left: -el.clientWidth * 0.8, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    const el = scrollRef.current
    if (el) {
      el.scrollBy({ left: el.clientWidth * 0.8, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-6" aria-label="Catégories">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="relative">
          <div
            ref={scrollRef}
            className={cn(
              'flex gap-3',
              'scrollbar-hide',
              'lg:grid lg:grid-cols-8 lg:gap-3 lg:overflow-visible',
              'snap-x lg:snap-none'
            )}
            role="list"
          >
            {enabledTiles.map((tile, _index) => {
              const isPlatform = !!tile.logo
              const logoConfig = tile.logo ? brandLogoFor(tile.logo) : null
              const brandColor = logoConfig?.color

              return (
                <Link
                  key={tile.slug}
                  href={`/catalogue?category=${tile.slug}`}
                  className={cn(
                    'tile-depth',
                    'flex items-center gap-3',
                    'h-16',
                    'w-full lg:w-auto',
                    'min-w-[150px] lg:min-w-0',
                    'snap-center lg:snap-none',
                    'group',
                    'role',
                    'listitem'
                  )}
                  aria-label={tile.name}
                >
                  <div
                    className={cn(
                      'flex-shrink-0 flex items-center justify-center',
                      'w-[36px] h-[36px] rounded-lg',
                      'bg-gradient-to-br from-muted to-muted/60',
                      'group-hover:shadow-lg',
                      'transition-all duration-180'
                    )}
                    aria-hidden="true"
                  >
                    {isPlatform && logoConfig ? (
                      <LogoIcon
                        name={logoConfig.name}
                        tone="mono"
                        size={22}
                        className={cn(
                          'transition-colors duration-180',
                          'text-muted-foreground',
                          brandColor && 'group-hover:[&>svg]:text-brandColor',
                          brandColor && `group-hover:[&>svg]:text-[${brandColor}]`
                        )}
                      />
                    ) : (
                      <span
                        className="text-muted-foreground group-hover:text-primary transition-colors duration-180"
                        aria-hidden="true"
                      >
                        {tile.icon}
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-[11px] leading-tight tracking-wide uppercase font-semibold',
                      'max-w-[120px] lg:max-w-[140px]',
                      'line-clamp-2',
                      'text-muted-foreground group-hover:text-primary transition-colors duration-180',
                      'whitespace-normal break-words'
                    )}
                  >
                    {tile.name}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Scroll arrows - only visible below lg */}
          <div className="hidden lg:hidden absolute inset-0 pointer-events-none z-10">
            {showLeftArrow && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-[-14px] w-8 h-8 rounded-full bg-surface/90 backdrop-blur-sm shadow-lg border border-border flex items-center justify-center text-foreground hover:bg-primary/10 hover:text-primary transition-colors pointer-events-auto"
                aria-label="Défilement gauche"
                aria-hidden="false"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
            {showRightArrow && (
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[14px] w-8 h-8 rounded-full bg-surface/90 backdrop-blur-sm shadow-lg border border-border flex items-center justify-center text-foreground hover:bg-primary/10 hover:text-primary transition-colors pointer-events-auto"
                aria-label="Défilement droit"
                aria-hidden="false"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}