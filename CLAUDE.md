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