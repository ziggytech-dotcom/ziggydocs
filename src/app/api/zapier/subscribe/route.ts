export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { event_type, target_url, secret } = body as {
    event_type: string
    target_url: string
    secret?: string
  }

  if (!event_type || !target_url) {
    return Response.json({ error: 'event_type and target_url required' }, { status: 400 })
  }

  const VALID_EVENTS = [
    'document.sent',
    'document.viewed',
    'document.signed',
    'document.completed',
    'document.voided',
  ]
  if (!VALID_EVENTS.includes(event_type)) {
    return Response.json({ error: `Invalid event_type. Must be one of: ${VALID_EVENTS.join(', ')}` }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('zapier_subscriptions')
    .insert({
      user_id: user.id,
      event_type,
      target_url,
      secret: secret ?? null,
    })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data, { status: 201 })
}
