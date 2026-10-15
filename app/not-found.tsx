import Link from 'next/link'
import { getServerI18n } from '@/lib/i18n/server'

export default async function NotFound() {
  const { t } = await getServerI18n()

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <p className="text-6xl font-bold text-primary mb-4">404</p>
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{t.notFound.title}</h1>
      <p className="text-muted-foreground mb-6">{t.notFound.text}</p>
      <Link
        href="/"
        className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
      >
        {t.notFound.back}
      </Link>
    </div>
  )
}
