'use client'

import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-hero text-hero-foreground" aria-labelledby="hero-title">
      <div className="absolute inset-0 bg-gradient-to-b from-hero via-hero to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1
            id="hero-title"
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            Abonnements numériques{' '}
            <span className="text-primary">& crédits de jeu</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Tes abonnements préférés — Gemini Pro, ChatGPT Plus, Canva Pro, Netflix —
            et tes crédits de jeu, livrés sur WhatsApp en quelques minutes.
            Paiement Mobile Money ou dépôt bancaire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/catalogue"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              Voir le catalogue
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <a
              href="#contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-border text-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403c-.454-1.805-.777-3.242-.53-3.742.416-.837 1.043-1.642 2.122-2.406.093-.063.155-.14.259-.216.224-.163.613-.159 1.09.036.242.1 1.277 1.194 1.172 1.351-.087.134-1.595 1.988-3.613 2.473-1.937.464-2.492.337-2.492.337" />
              </svg>
              Commander sur WhatsApp
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Livraison rapide
            </span>
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Paiement Mobile Money
            </span>
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Support 7j/7
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}