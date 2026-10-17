'use client'

import { useRouter } from 'next/navigation'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { LOCALE_COOKIE, type Locale } from '@/lib/i18n/format'
import { cn } from '@/lib/utils'

const OPTIONS: Locale[] = ['fr', 'en']

export function LanguageToggle({ className }: { className?: string }) {
  const router = useRouter()
  const { locale, t } = useLocale()

  const setLanguage = (next: Locale) => {
    if (next === locale) return
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`
    router.refresh()
  }

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn('inline-flex items-center rounded-lg bg-white/10 p-0.5 text-sm font-semibold', className)}
    >
      {OPTIONS.map(option => {
        const active = option === locale
        return (
          <button
            key={option}
            type="button"
            onClick={() => setLanguage(option)}
            aria-pressed={active}
            aria-label={option === 'fr' ? t.common.languageFr : t.common.languageEn}
            className={cn(
              'h-9 px-2 sm:px-2.5 rounded-md uppercase transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-header-foreground/80 hover:text-header-foreground hover:bg-white/10'
            )}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
