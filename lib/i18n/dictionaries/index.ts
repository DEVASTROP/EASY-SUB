import { fr } from './fr'
import { en } from './en'
import type { Locale } from '../format'

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Widen<U>[]
    : T extends object
      ? { [K in keyof T]: Widen<T[K]> }
      : T

/** The English dictionary is typed from the French one: a missing key is a TypeScript error. */
export type Dictionary = Widen<typeof fr>

const dictionaries: Record<Locale, Dictionary> = { fr, en }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.fr
}
