import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BulkSendClient from './BulkSendClient'
import { ZiggyDocsLogo } from '@/components/ZiggyDocsLogo'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function BulkSendPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-[#888] hover:text-white transition-colors">
            <ArrowLeft size={16} />
            <span className="text-sm">Dashboard</span>
          </Link>
          <div className="flex items-center gap-2 ml-4">
            <ZiggyDocsLogo size="sm" />
          </div>
        </div>
      </nav>
      <BulkSendClient userId={user.id} />
    </div>
  )
}
