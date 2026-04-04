'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'ziggydocs_cookie_consent'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) setVisible(true)
    } catch {
      // localStorage unavailable (private browsing etc.) &mdash; don't show
    }
  }, [])

  const dismiss = (accepted: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, accepted ? 'accepted' : 'declined')
    } catch {
      // ignore
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto bg-[#111] border border-[#333] rounded-2xl shadow-2xl shadow-black/60 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium mb-1">🍪 We use cookies</p>
          <p className="text-[#888] text-xs leading-relaxed">
            We use cookies to keep you signed in and improve your experience. By continuing,
            you agree to our{' '}
            <Link href="/cookies" className="text-[#7c3aed] hover:underline">
              Cookie Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => dismiss(false)}
            className="text-xs text-[#555] hover:text-[#888] transition-colors px-3 py-2"
          >
            Decline
          </button>
          <button
            onClick={() => dismiss(true)}
            className="text-xs bg-[#7c3aed] hover:bg-[#6d28d9] active:bg-[#5b21b6] text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Accept cookies
          </button>
        </div>
      </div>
    </div>
  )
}
