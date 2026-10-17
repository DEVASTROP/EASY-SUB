# EASY-SUB - Digital Subscription Catalog for Togo Students

## Project Description
Small catalog website selling digital subscriptions (Gemini Pro, ChatGPT Plus, Canva Pro, Netflix) and game credits to students in Togo. No online payment/cart. Each product has "Order on WhatsApp" button with pre-filled message. Owner handles payment (Mobile Money/bank deposit) and delivery manually on WhatsApp.

## Stack
- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Supabase (Postgres + Auth), Framer Motion
- UI Language: French

## Hard Rules (Windows/PowerShell)
- Never chain commands with "&&" - run one command per call
- Never run "npm run dev" or start any server
- Never run "npm run build" while "npm run dev" may be running - verification is limited to `npx tsc --noEmit` and `npm run lint`
- Create/edit files with file tools, never shell redirection/piping
- Allowed checks: `npx tsc --noEmit` and `npm run lint` after each phase
- Fix all errors before moving to next phase
- No invented features - pick simplest option for ambiguities

## Folder Structure (evolves)
```
/app
  /page.tsx              # Home - featured + grouped by category
  /produit/[slug]/page.tsx  # Product details + WhatsApp
  /admin
    /login/page.tsx
    /page.tsx            # Product list with margins + hide toggle
    /produits/[id]/page.tsx  # Create/edit form + live margin preview
/lib
  /supabase/client.ts    # Browser client
  /supabase/server.ts    # Server client
  /whatsapp.ts           # buildWhatsAppLink()
  /margin.ts             # computeMargin()
/types/index.ts          # Product, PublicProduct, Category types
/supabase/schema.sql     # Database schema (not executed here)
/middleware.ts           # Protect /admin routes
/globals.css             # CSS variables for theming
/tailwind.config.ts      # Theme mapping
/.env.local.example      # Env template
/public
  /products/             # Product images (referenced as "/products/<file>.jpg")
```

## Image Conventions
- Product images go in `/public/products/` (e.g., `/public/products/gemini-pro.jpg`)
- In database/admin, reference them as `/products/<filename>.jpg`
- Use `next/image` with `fill` + `sizes` prop for responsive images
- Add `priority` for above-the-fold images (featured product, product detail page)
## Internationalisation (FR / EN)
- Language is stored in the `lang` cookie ("fr" default, "en"). Server code: `getLocale()` / `getServerI18n()` from `lib/i18n/server.ts`. Client code: `useLocale()` / `useT()` from `lib/i18n/LocaleProvider.tsx`.
- Every public text lives in `lib/i18n/dictionaries/fr.ts` and `en.ts`. The English file is typed from the French one, so a missing key is a TypeScript error. RULE: every new public text must be added to BOTH dictionaries; never hardcode French or English in public components.
- Prices: `formatPrice()`; durations: `formatDuration()`; product/category texts: `localized(item, 'name', locale)` (falls back to French when the `_en` field is empty); all in `lib/i18n/format.ts`.
- Admin pages stay French only and have no language switch.
- Product English fields (`name_en`, `short_description_en`, `description_en`, `warranty_note_en`) and `categories.name_en` come from supabase/migrations/005_english_fields.sql.

## Brand assets
- Sources: public/logo.png (full logo, designed for DARK backgrounds: the word EASY is white) and public/favicon.png (violet E mark). Do not edit them.
- Generated assets: app/icon.png, app/apple-icon.png, app/favicon.ico (browser icons, picked up automatically by Next.js), public/logo-header.png (wordmark without tagline, used in the dark header), public/logo-footer.png (full logo recolored for light backgrounds, used in the footer), public/brand-mark.png (violet mark alone), public/og-image.png (1200x630 link preview), public/hero-bg.jpg (optimised JPEG).
- NEXT_PUBLIC_SITE_URL must be set to the real site URL in production (Vercel) for link previews.
