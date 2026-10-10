import Link from 'next/link'
import { LogoIcon } from './LogoIcon'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Produits: [
      { label: 'Catalogue', href: '/catalogue' },
      { label: 'IA & Outils', href: '/catalogue?category=ia-et-outils' },
      { label: 'Divertissement', href: '/catalogue?category=divertissement' },
      { label: 'Jeux', href: '/catalogue?category=jeux' },
    ],
    Aide: [
      { label: 'Comment commander', href: '#comment-ca-marche' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '#contact' },
    ],
    Légal: [
      { label: 'CGU', href: '/cgu' },
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Confidentialité', href: '/confidentialite' },
    ],
  }

  return (
    <footer className="bg-background border-t border-border" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-bold text-primary" aria-label="EASY-SUB Accueil">
              EASY-SUB
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Tes abonnements numériques et crédits de jeu préférés, livrés sur WhatsApp en quelques minutes.
              Paiement Mobile Money ou dépôt bancaire.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <nav key={title} aria-labelledby={`footer-${title.toLowerCase()}`}>
              <h3 id={`footer-${title.toLowerCase()}`} className="font-semibold mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} EASY-SUB. Tous droits réservés.
            </p>
            <p className="text-xs text-muted-foreground/70">
              Les noms de marques et logos cités appartiennent à leurs propriétaires respectifs. EASY-SUB n'est pas affilié à ces marques.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth="2" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" />
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="WhatsApp"
              >
                <LogoIcon name="whatsapp" tone="mono" size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}