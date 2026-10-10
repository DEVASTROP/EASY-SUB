import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const formData = await request.formData()
  const inStock = formData.get('in_stock') === 'true'

  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL('/admin/login', request.url), { status: 303 })
  }

  const { error } = await supabase
    .from('products')
    .update({ in_stock: inStock })
    .eq('id', id)

  if (error) {
    console.error('Error toggling stock:', error)
    return NextResponse.redirect(new URL('/admin?error=toggle_failed', request.url), { status: 303 })
  }

  revalidatePath('/admin')
  return NextResponse.redirect(new URL('/admin', request.url), { status: 303 })
}