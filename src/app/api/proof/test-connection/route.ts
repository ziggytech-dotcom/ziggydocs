export const dynamic = 'force-dynamic';
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/proof/test-connection
// Validates stored Proof API key + account ID by calling /v1/account
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data: integration } = await admin
    .from('zd_org_integrations')
    .select('config')
    .eq('user_id', user.id)
    .eq('provider', 'proof')
    .single()

  const { api_key, account_id } = (integration?.config ?? {}) as { api_key?: string; account_id?: string }

  if (!api_key || !account_id) {
    return Response.json({ error: 'Save your API key and Account ID first.' }, { status: 422 })
  }

  try {
    const res = await fetch(`https://api.proof.com/v1/accounts/${account_id}`, {
      headers: { Authorization: `Bearer ${api_key}` },
    })

    if (res.ok) {
      const data = await res.json() as { name?: string }
      return Response.json({ success: true, accountName: data.name ?? account_id })
    }

    return Response.json({ error: `Proof returned ${res.status}. Check your API key and Account ID.` }, { status: 422 })
  } catch {
    return Response.json({ error: 'Could not reach Proof API. Check your network or API key.' }, { status: 502 })
  }
}
