'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { Dictionary } from './dictionaries'
import type { Locale } from './format'

interface LocaleContextValue {
  locale: Locale
  t: Dictionary
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale
  dictionary: Dictionary
  children: ReactNode
}) {
  return <LocaleContext.Provider value={{ locale, t: dictionary }}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>')
  return ctx
}

export function useT(): Dictionary {
  return useLocale().t
}
