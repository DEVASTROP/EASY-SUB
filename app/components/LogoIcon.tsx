'use client'

import { brandLogoFor, LOGOS, type BrandLogoConfig } from '@/lib/logos'
import Image from 'next/image'

interface LogoIconProps {
  name?: string
  productName?: string
  tone?: 'brand' | 'mono'
  className?: string
  size?: number
}

export function LogoIcon({ name, productName, tone = 'brand', className = '', size = 20 }: LogoIconProps) {
  let logo: BrandLogoConfig | null = null

  if (name) {
    logo = LOGOS.find(l => l.name === name) || null
  } else if (productName) {
    logo = brandLogoFor(productName)
  }

  if (!logo) {
    return null
  }

  // Canva is multicolor - use Image for multicolor logos when tone is brand
  if (logo.isMulticolor && tone === 'brand') {
    return (
      <Image
        src={`/logos/${logo.name}.svg`}
        alt={logo.name}
        width={size}
        height={size}
        className={className}
        aria-hidden="true"
      />
    )
  }

  // Mono tone or non-multicolor: use mask-image with currentColor
  const maskUrl = `/logos/${logo.name}.svg`
  const color = tone === 'mono' ? 'currentColor' : logo.color

  return (
    <span
      className={`${className} inline-flex shrink-0`}
      style={{
        width: size,
        height: size,
        maskImage: `url(${maskUrl})`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: `url(${maskUrl})`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        backgroundColor: color,
      }}
      aria-hidden="true"
    />
  )
}