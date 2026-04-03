import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import SettingsClient from './SettingsClient'
import Link from 'next/link'
import { ArrowLeft, PenLine } from 'lucide-react'
import { ZiggyDocsLogo } from '@/components/ZiggyDocsLogo'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: integrations } = await admin
    .from('zd_org_integrations')
    .select('provider, config')
    .eq('user_id', user.id)

  const saved: Record<string, Record<string, string>> = {}
  for (const row of integrations ?? []) {
    saved[row.provider] = row.config ?? {}
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-[#888] hover:text-white transition-colors">
            <ArrowLeft size={16} />
            <span className="text-sm">Dashboard</span>
          </Link>
          <ZiggyDocsLogo size="sm" />
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-[#888] text-sm mt-1">Manage integrations and account preferences</p>
        </div>

        <SettingsClient savedIntegrations={saved} />
      </div>
    </div>
  )
}
