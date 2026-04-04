'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ZiggyDocsLogo } from '@/components/ZiggyDocsLogo'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-6">
            <ZiggyDocsLogo size="lg" />
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
          <p className="text-[#888] text-sm">Free forever &middot; No credit card required</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#888] uppercase tracking-widest mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#7c3aed] transition-colors text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-[#888] uppercase tracking-widest mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Minimum 8 characters"
              className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#7c3aed] transition-colors text-sm"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-[#555] text-xs mt-4 leading-relaxed">
          By signing up you agree to our Terms of Service and Privacy Policy.
        </p>
        <p className="text-center text-[#888] text-sm mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-[#7c3aed] hover:text-[#a78bfa] transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
