'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-muted text-muted-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted/80 transition-colors text-sm"
    >
      Déconnexion
    </button>
  )
}