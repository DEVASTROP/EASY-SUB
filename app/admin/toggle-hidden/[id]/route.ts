import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const formData = await request.formData()
  const isHidden = formData.get('is_hidden') === 'true'

  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  const { error } = await supabase
    .from('products')
    .update({ is_hidden: isHidden })
    .eq('id', id)

  if (error) {
    console.error('Error toggling hidden:', error)
    return NextResponse.redirect(new URL('/admin?error=toggle_failed', request.url))
  }

  revalidatePath('/admin')
  return NextResponse.redirect(new URL('/admin', request.url))
}