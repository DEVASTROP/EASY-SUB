import Link from 'next/link'

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
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403c-.454-1.805-.777-3.242-.53-3.742.416-.837 1.043-1.642 2.122-2.406.093-.063.155-.14.259-.216.224-.163.613-.159 1.09.036.242.1 1.277 1.194 1.172 1.351-.087.134-1.595 1.988-3.613 2.473-1.937.464-2.492.337-2.492.337" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}