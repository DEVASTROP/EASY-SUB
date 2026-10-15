import { cookies } from 'next/headers'
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from './format'
import { getDictionary } from './dictionaries'

/** Reads the language cookie on the server ("fr" by default). */
export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  return isLocale(value) ? value : DEFAULT_LOCALE
}

export async function getServerI18n() {
  const locale = await getLocale()
  return { locale, t: getDictionary(locale) }
}
