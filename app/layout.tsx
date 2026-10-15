import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import { PublicLayout } from './components/PublicLayout'
import { LocaleProvider } from '@/lib/i18n/LocaleProvider'
import { getLocale } from '@/lib/i18n/server'
import { getDictionary } from '@/lib/i18n/dictionaries'

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale())
  return {
    title: t.site.metaTitle,
    description: t.site.metaDescription,
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const dictionary = getDictionary(locale)

  return (
    <html lang={locale}>
      <body className="min-h-screen">
        <LocaleProvider locale={locale} dictionary={dictionary}>
          <Suspense fallback={null}>
            <PublicLayout>{children}</PublicLayout>
          </Suspense>
        </LocaleProvider>
      </body>
    </html>
  )
}
