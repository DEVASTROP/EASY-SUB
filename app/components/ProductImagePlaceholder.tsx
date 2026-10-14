'use client'

import { brandLogoFor } from '@/lib/logos'
import { LogoIcon } from './LogoIcon'

interface ProductImagePlaceholderProps {
  productName: string
  className?: string
}

export function ProductImagePlaceholder({ productName, className = '' }: ProductImagePlaceholderProps) {
  const logo = brandLogoFor(productName)

  if (!logo) {
    return (
      <div className={`aspect-square bg-gradient-to-br from-muted via-muted/50 to-muted ${className}`} aria-hidden="true">
        <div className="w-full h-full flex items-center justify-center">
          <svg className="w-12 h-12 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    )
  }

  const fromColor = logo.isMulticolor ? logo.color + '20' : logo.color + '30'
  const viaColor = logo.isMulticolor ? logo.color + '10' : logo.color + '15'

  if (logo.isMulticolor) {
    return (
      <div className={`aspect-square relative overflow-hidden ${className}`} aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br" style={{
          backgroundImage: `linear-gradient(to bottom right, ${fromColor}, ${viaColor}, transparent)`,
        }} />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <LogoIcon name={logo.name} tone="brand" size={64} />
        </div>
      </div>
    )
  }

  return (
    <div className={`aspect-square relative overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-br" style={{
        backgroundImage: `linear-gradient(to bottom right, ${fromColor}, ${viaColor}, transparent)`,
      }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <LogoIcon name={logo.name} tone="mono" size={56} className="text-foreground/20" />
      </div>
    </div>
  )
}