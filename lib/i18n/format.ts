export type Locale = 'fr' | 'en'

export const LOCALES: Locale[] = ['fr', 'en']
export const DEFAULT_LOCALE: Locale = 'fr'
export const LOCALE_COOKIE = 'lang'

export function isLocale(value: unknown): value is Locale {
  return value === 'fr' || value === 'en'
}

/** "5 000 FCFA" in French, "5,000 FCFA" in English. */
export function formatPrice(amount: number, locale: Locale): string {
  const formatted = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'fr-FR').format(amount)
  return `${formatted} FCFA`
}

/** Converts French durations ("18 mois", "1 an", "à vie") to English. French is returned unchanged. */
export function formatDuration(duration: string | null | undefined, locale: Locale): string {
  if (!duration) return ''
  if (locale === 'fr') return duration

  const text = duration.trim()
  if (/^à\s*vie$/i.test(text) || /^a\s*vie$/i.test(text)) return 'lifetime'

  const units: Array<[RegExp, string, string]> = [
    [/^(\d+)\s*mois$/i, 'month', 'months'],
    [/^(\d+)\s*ans?$/i, 'year', 'years'],
    [/^(\d+)\s*jours?$/i, 'day', 'days'],
    [/^(\d+)\s*semaines?$/i, 'week', 'weeks'],
  ]
  for (const [regex, singular, plural] of units) {
    const match = text.match(regex)
    if (match) {
      const n = parseInt(match[1], 10)
      return `${n} ${n === 1 ? singular : plural}`
    }
  }
  return text
}

/** Replaces {key} placeholders in a dictionary string. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => (key in values ? String(values[key]) : `{${key}}`))
}

/**
 * Returns the English version of a field when it exists and is not empty,
 * otherwise the French value (the site never shows an empty text).
 */
export function localized<T extends object>(item: T, field: string, locale: Locale): string {
  const record = item as Record<string, unknown>
  const base = record[field]
  if (locale === 'en') {
    const en = record[`${field}_en`]
    if (typeof en === 'string' && en.trim() !== '') return en
  }
  return typeof base === 'string' ? base : ''
}
