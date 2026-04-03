import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, FileText, PenLine, LayoutTemplate } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import TemplatesClient from './TemplatesClient'

export const dynamic = 'force-dynamic'

export default async function TemplatesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: templates } = await admin
    .from('zd_templates')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-[#888] hover:text-white transition-colors">
            <ArrowLeft size={16} />
            <span className="text-sm">Dashboard</span>
          </Link>
          <div className="flex items-center gap-2 ml-2">
            <div className="w-6 h-6 rounded-lg bg-[#7c3aed] flex items-center justify-center">
              <PenLine size={12} className="text-white" />
            </div>
            <span className="font-bold text-sm">Templates</span>
          </div>
        </div>
      </nav>
      <TemplatesClient templates={templates ?? []} userId={user.id} />
    </div>
  )
}
