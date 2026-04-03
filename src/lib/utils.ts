export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function statusColor(status: string) {
  switch (status) {
    case 'draft': return 'text-[#888] bg-[#888]/10 border-[#888]/30'
    case 'sent': return 'text-blue-400 bg-blue-400/10 border-blue-400/30'
    case 'viewed': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
    case 'signed': return 'text-green-400 bg-green-400/10 border-green-400/30'
    case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/30'
    case 'declined': return 'text-orange-400 bg-orange-400/10 border-orange-400/30'
    case 'voided': return 'text-red-400 bg-red-400/10 border-red-400/30'
    case 'notarization_requested': return 'text-blue-400 bg-blue-400/10 border-blue-400/30'
    case 'notarized': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
    default: return 'text-[#888] bg-[#888]/10 border-[#888]/30'
  }
}
