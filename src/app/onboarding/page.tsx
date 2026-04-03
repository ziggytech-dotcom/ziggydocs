'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ZiggyDocsLogo } from '@/components/ZiggyDocsLogo'
import { ArrowRight, FileText, UserPlus, LayoutTemplate, Sparkles } from 'lucide-react'

const TOTAL_STEPS = 4

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Phoenix',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Amsterdam',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Pacific/Auckland',
]

const TIMEZONE_LABELS: Record<string, string> = {
  'America/New_York': 'Eastern Time (ET)',
  'America/Chicago': 'Central Time (CT)',
  'America/Denver': 'Mountain Time (MT)',
  'America/Los_Angeles': 'Pacific Time (PT)',
  'America/Phoenix': 'Arizona (no DST)',
  'America/Anchorage': 'Alaska Time (AKT)',
  'Pacific/Honolulu': 'Hawaii Time (HT)',
  'Europe/London': 'London (GMT/BST)',
  'Europe/Paris': 'Paris (CET/CEST)',
  'Europe/Berlin': 'Berlin (CET/CEST)',
  'Europe/Amsterdam': 'Amsterdam (CET/CEST)',
  'Asia/Dubai': 'Dubai (GST)',
  'Asia/Kolkata': 'India (IST)',
  'Asia/Singapore': 'Singapore (SGT)',
  'Asia/Tokyo': 'Tokyo (JST)',
  'Asia/Shanghai': 'China (CST)',
  'Australia/Sydney': 'Sydney (AEST/AEDT)',
  'Australia/Melbourne': 'Melbourne (AEST/AEDT)',
  'Pacific/Auckland': 'Auckland (NZST/NZDT)',
}

const TEMPLATE_TYPES = ['Contract', 'Proposal', 'NDA', 'Invoice', 'Other']

interface OnboardingData {
  businessName: string
  yourName: string
  timezone: string
  templateName: string
  templateType: string
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs text-[#555] uppercase tracking-widest">
          Step {step} of {TOTAL_STEPS}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={`h-1 w-8 rounded-full transition-all duration-500 ${
                i < step ? 'bg-[#7c3aed]' : 'bg-[#1a1a1a]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function SkipLink({ onClick, label = 'Skip for now' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-center text-xs text-[#555] hover:text-[#888] transition-colors py-1"
    >
      {label}
    </button>
  )
}

// Step 1 — Welcome
function StepWelcome({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  return (
    <div className="text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#7c3aed]/10 flex items-center justify-center mx-auto mb-6">
        <Sparkles size={24} className="text-[#7c3aed]" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-3">
        Let&apos;s get ZiggyDocs set up
      </h1>
      <p className="text-[#888] text-sm leading-relaxed mb-8">
        We&apos;ll walk you through a few quick steps so you can start sending documents for signature in minutes.
      </p>
      <button
        onClick={onNext}
        className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mb-3"
      >
        Get Started
        <ArrowRight size={16} />
      </button>
      <SkipLink onClick={onSkip} label="Skip to dashboard" />
    </div>
  )
}

// Step 2 — Business Info
function StepBusinessInfo({
  businessName,
  setBusinessName,
  yourName,
  setYourName,
  timezone,
  setTimezone,
  onNext,
  onSkip,
}: {
  businessName: string
  setBusinessName: (v: string) => void
  yourName: string
  setYourName: (v: string) => void
  timezone: string
  setTimezone: (v: string) => void
  onNext: () => void
  onSkip: () => void
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-1">Tell us about your business</h2>
      <p className="text-[#888] text-sm mb-6">This helps personalize your experience.</p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs text-[#888] uppercase tracking-widest mb-1.5">
            Business Name
          </label>
          <input
            type="text"
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            placeholder="Acme Corp"
            className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#7c3aed] transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-[#888] uppercase tracking-widest mb-1.5">
            Your Name
          </label>
          <input
            type="text"
            value={yourName}
            onChange={e => setYourName(e.target.value)}
            placeholder="Jane Smith"
            className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#7c3aed] transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-[#888] uppercase tracking-widest mb-1.5">
            Timezone
          </label>
          <select
            value={timezone}
            onChange={e => setTimezone(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7c3aed] transition-colors text-sm appearance-none cursor-pointer"
          >
            {TIMEZONES.map(tz => (
              <option key={tz} value={tz}>
                {TIMEZONE_LABELS[tz] ?? tz}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mb-3"
      >
        Continue
        <ArrowRight size={16} />
      </button>
      <SkipLink onClick={onSkip} />
    </div>
  )
}

// Step 3 — Create First Template
function StepCreateTemplate({
  templateName,
  setTemplateName,
  templateType,
  setTemplateType,
  onNext,
  onSkip,
}: {
  templateName: string
  setTemplateName: (v: string) => void
  templateType: string
  setTemplateType: (v: string) => void
  onNext: () => void
  onSkip: () => void
}) {
  return (
    <div>
      <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/10 flex items-center justify-center mb-5">
        <LayoutTemplate size={18} className="text-[#7c3aed]" />
      </div>
      <h2 className="text-xl font-bold text-white mb-1">Create your first template</h2>
      <p className="text-[#888] text-sm mb-6">
        Templates save time — define a document once, send it to anyone.
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs text-[#888] uppercase tracking-widest mb-1.5">
            Template Name
          </label>
          <input
            type="text"
            value={templateName}
            onChange={e => setTemplateName(e.target.value)}
            placeholder="e.g. Client Services Agreement"
            className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-[#7c3aed] transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-[#888] uppercase tracking-widest mb-1.5">
            Document Type
          </label>
          <select
            value={templateType}
            onChange={e => setTemplateType(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7c3aed] transition-colors text-sm appearance-none cursor-pointer"
          >
            {TEMPLATE_TYPES.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!templateName.trim()}
        className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mb-3"
      >
        Create Template
        <ArrowRight size={16} />
      </button>
      <SkipLink onClick={onSkip} label="Skip, I'll do this later" />
    </div>
  )
}

// Step 4 — Done
function StepDone({ onFinish }: { onFinish: () => void }) {
  const nextSteps = [
    {
      icon: FileText,
      label: 'Create a document',
      description: 'Send your first document for signature.',
      href: '/documents',
    },
    {
      icon: UserPlus,
      label: 'Invite a signer',
      description: 'Add recipients to any document instantly.',
      href: '/documents',
    },
    {
      icon: LayoutTemplate,
      label: 'Browse templates',
      description: 'Explore ready-to-use document templates.',
      href: '/templates',
    },
  ]

  return (
    <div className="text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#7c3aed]/10 flex items-center justify-center mx-auto mb-6">
        <div className="text-[#7c3aed] text-2xl">✓</div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">You&apos;re ready</h2>
      <p className="text-[#888] text-sm mb-8">
        Your workspace is set up. Here&apos;s what you can do next.
      </p>

      <div className="space-y-3 mb-8 text-left">
        {nextSteps.map(({ icon: Icon, label, description, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-4 bg-[#0a0a0a] border border-[#222] hover:border-[#7c3aed]/40 rounded-xl px-4 py-3.5 transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#7c3aed]/10 flex items-center justify-center shrink-0">
              <Icon size={16} className="text-[#7c3aed]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white">{label}</div>
              <div className="text-xs text-[#555] mt-0.5">{description}</div>
            </div>
            <ArrowRight size={14} className="text-[#444] group-hover:text-[#7c3aed] transition-colors shrink-0" />
          </Link>
        ))}
      </div>

      <button
        onClick={onFinish}
        className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium py-3 rounded-xl transition-colors"
      >
        Go to Dashboard
      </button>
    </div>
  )
}

// Main Page
export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [ready, setReady] = useState(false)

  // Business Info
  const [businessName, setBusinessName] = useState('')
  const [yourName, setYourName] = useState('')
  const [timezone, setTimezone] = useState(
    typeof window !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : 'America/New_York'
  )

  // Template
  const [templateName, setTemplateName] = useState('')
  const [templateType, setTemplateType] = useState('Contract')

  useEffect(() => {
    const complete = localStorage.getItem('onboarding_complete')
    if (complete === 'true') {
      router.replace('/dashboard')
      return
    }

    const savedStep = localStorage.getItem('onboarding_step')
    if (savedStep) {
      const n = parseInt(savedStep, 10)
      if (n >= 1 && n <= TOTAL_STEPS) setStep(n)
    }

    const savedData = localStorage.getItem('onboarding_data')
    if (savedData) {
      try {
        const data: Partial<OnboardingData> = JSON.parse(savedData)
        if (data.businessName) setBusinessName(data.businessName)
        if (data.yourName) setYourName(data.yourName)
        if (data.timezone) setTimezone(data.timezone)
        if (data.templateName) setTemplateName(data.templateName)
        if (data.templateType) setTemplateType(data.templateType)
      } catch {
        // ignore corrupt data
      }
    }

    setReady(true)
  }, [router])

  const persist = (nextStep: number, extra?: Partial<OnboardingData>) => {
    localStorage.setItem('onboarding_step', String(nextStep))
    const data: OnboardingData = {
      businessName,
      yourName,
      timezone,
      templateName,
      templateType,
      ...extra,
    }
    localStorage.setItem('onboarding_data', JSON.stringify(data))
  }

  const advance = (nextStep: number, extra?: Partial<OnboardingData>) => {
    persist(nextStep, extra)
    setStep(nextStep)
  }

  const complete = () => {
    localStorage.setItem('onboarding_complete', 'true')
    localStorage.removeItem('onboarding_step')
    localStorage.removeItem('onboarding_data')
    router.push('/dashboard')
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-[#7c3aed] border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center">
            <ZiggyDocsLogo size="lg" />
          </Link>
        </div>

        {/* Progress */}
        <ProgressBar step={step} />

        {/* Card */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-8">
          {step === 1 && (
            <StepWelcome
              onNext={() => advance(2)}
              onSkip={complete}
            />
          )}

          {step === 2 && (
            <StepBusinessInfo
              businessName={businessName}
              setBusinessName={setBusinessName}
              yourName={yourName}
              setYourName={setYourName}
              timezone={timezone}
              setTimezone={setTimezone}
              onNext={() => advance(3, { businessName, yourName, timezone })}
              onSkip={() => advance(3)}
            />
          )}

          {step === 3 && (
            <StepCreateTemplate
              templateName={templateName}
              setTemplateName={setTemplateName}
              templateType={templateType}
              setTemplateType={setTemplateType}
              onNext={() => advance(4, { templateName, templateType })}
              onSkip={() => advance(4)}
            />
          )}

          {step === 4 && (
            <StepDone onFinish={complete} />
          )}
        </div>
      </div>
    </div>
  )
}
