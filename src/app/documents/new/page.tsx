import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NewDocumentClient from './NewDocumentClient'

export const dynamic = 'force-dynamic'

export default async function NewDocumentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return <NewDocumentClient userId={user.id} />
}
