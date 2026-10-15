'use client'

import { useLocale } from '@/lib/i18n/LocaleProvider'

export function HowItWorks() {
  const { t } = useLocale()
  const steps = t.how.steps.map((step, index) => ({ number: index + 1, ...step }))

  return (
    <section id="comment-ca-marche" className="py-16 md:py-24 bg-background" aria-labelledby="how-title">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <header className="text-center mb-16">
          <h2 id="how-title" className="text-3xl md:text-4xl font-bold mb-4">{t.how.title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t.how.subtitle}</p>
        </header>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {steps.map(step => (
            <div key={step.number} className="text-center p-6">
              <div className="w-20 h-20 mx-auto mb-5 bg-primary/10 rounded-2xl flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">{step.number}</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}