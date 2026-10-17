'use client'

import { useState, type ReactNode } from 'react'
import { SlidersHorizontal, ChevronDown } from 'lucide-react'
import { useLocale } from '@/lib/i18n/LocaleProvider'

/**
 * On phones the filters are collapsed behind a button so the products show first.
 * From the lg breakpoint the filters are always visible (sidebar).
 */
export function FiltersToggle({ children }: { children: ReactNode }) {
  const { t } = useLocale()
  const [open, setOpen] = useState(false)

  return (
    <aside className="lg:w-64 flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
        className="lg:hidden w-full flex items-center justify-between gap-2 px-4 h-12 rounded-xl bg-surface border border-border shadow-sm font-semibold"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary" aria-hidden="true" />
          {t.catalogue.filtersButton}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <div className={`${open ? 'block mt-4' : 'hidden'} lg:block space-y-6`}>{children}</div>
    </aside>
  )
}
