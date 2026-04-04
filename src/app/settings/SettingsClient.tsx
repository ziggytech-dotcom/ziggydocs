'use client'
import { useState } from 'react'
import { PenLine, ExternalLink, CheckCircle, AlertTriangle, Trash2, Zap, ShieldCheck, Loader2 } from 'lucide-react'

interface Props {
  savedIntegrations: Record<string, Record<string, string>>
}

interface ProviderConfig {
  id: string
  name: string
  logo: string
  description: string
  fields: Array<{ key: string; label: string; placeholder: string; type?: string }>
}

const PROVIDERS: ProviderConfig[] = [
  {
    id: 'docusign',
    name: 'DocuSign',
    logo: '📄',
    description: 'Use your own DocuSign account for sending envelopes.',
    fields: [
      { key: 'api_key', label: 'Integration Key', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
      { key: 'account_id', label: 'Account ID', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
      { key: 'base_url', label: 'Base URL', placeholder: 'https://demo.docusign.net/restapi' },
    ],
  },
  {
    id: 'pandadoc',
    name: 'PandaDoc',
    logo: '🐼',
    description: 'Use your own PandaDoc API key for document management.',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'your-pandadoc-api-key', type: 'password' },
    ],
  },
]

function ProofSection({ savedConfig }: { savedConfig: Record<string, string> }) {
  const [config, setConfig] = useState({ api_key: savedConfig.api_key ?? '', account_id: savedConfig.account_id ?? '' })
  const [enabled, setEnabled] = useState(savedConfig.enabled === 'true')
  const [expanded, setExpanded] = useState(!!savedConfig.api_key)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null)

  const isConfigured = !!savedConfig.api_key

  const save = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'proof', config: { ...config, enabled: String(enabled) } }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    setRemoving(true)
    try {
      await fetch('/api/integrations?provider=proof', { method: 'DELETE' })
      setConfig({ api_key: '', account_id: '' })
      setExpanded(false)
    } finally {
      setRemoving(false)
    }
  }

  const testConnection = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch('/api/proof/test-connection', { method: 'POST' })
      const data = await res.json() as { success?: boolean; accountName?: string; error?: string }
      if (res.ok && data.success) {
        setTestResult({ ok: true, msg: `Connected${data.accountName ? ` &mdash; ${data.accountName}` : ''}` })
      } else {
        setTestResult({ ok: false, msg: data.error ?? 'Connection failed' })
      }
    } catch {
      setTestResult({ ok: false, msg: 'Could not reach Proof API' })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck size={18} className="text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white font-medium">Proof.com</h3>
              {isConfigured && <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">Configured</span>}
            </div>
            <p className="text-[#888] text-xs mt-0.5">Remote Online Notarization (RON) &mdash; legally binding video notarization</p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-xs text-[#7c3aed] hover:text-[#a78bfa] transition-colors shrink-0 font-medium"
        >
          {expanded ? 'Collapse' : isConfigured ? 'Edit' : 'Configure'}
        </button>
      </div>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-[#1a1a1a] pt-4">
          <div className="bg-indigo-500/8 border border-indigo-500/20 rounded-xl px-4 py-3">
            <p className="text-indigo-300 text-xs leading-relaxed">
              Use your own Proof.com account (BYOK). Your API key is never shared.{' '}
              <a href="https://proof.com/partners" target="_blank" rel="noopener noreferrer"
                 className="underline underline-offset-2 hover:text-indigo-200 transition-colors">
                Get your keys →
              </a>
            </p>
          </div>

          {[
            { key: 'api_key', label: 'API Key', placeholder: 'proof_live_…', type: 'password' },
            { key: 'account_id', label: 'Account ID', placeholder: 'acc_…' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs text-[#888] uppercase tracking-widest mb-1.5">{f.label}</label>
              <input
                type={f.type ?? 'text'}
                value={config[f.key as keyof typeof config]}
                onChange={e => setConfig(prev => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-2.5 text-white placeholder-[#555] text-sm focus:outline-none focus:border-[#7c3aed] transition-colors font-mono"
              />
            </div>
          ))}

          {/* Enable RON toggle */}
          <div
            onClick={() => setEnabled(e => !e)}
            className={`flex items-start gap-4 p-3 rounded-xl border cursor-pointer transition-all ${
              enabled ? 'border-[#7c3aed]/40 bg-[#7c3aed]/5' : 'border-[#222] hover:border-[#333]'
            }`}
          >
            <div className={`mt-0.5 w-9 h-5 rounded-full relative transition-colors shrink-0 ${enabled ? 'bg-[#7c3aed]' : 'bg-[#333]'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${enabled ? 'left-4' : 'left-0.5'}`} />
            </div>
            <p className="text-sm text-white">Enable RON for this workspace</p>
          </div>

          {testResult && (
            <div className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
              testResult.ok
                ? 'bg-green-500/10 border border-green-500/30'
                : 'bg-red-500/10 border border-red-500/30'
            }`}>
              {testResult.ok
                ? <CheckCircle size={13} className="text-green-400 shrink-0" />
                : <AlertTriangle size={13} className="text-red-400 shrink-0" />}
              <p className={`text-xs ${testResult.ok ? 'text-green-400' : 'text-red-400'}`}>{testResult.msg}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={save}
              disabled={saving || (!config.api_key.trim() && !config.account_id.trim())}
              className="bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save'}
            </button>
            <button
              onClick={testConnection}
              disabled={testing || !config.api_key.trim() || !config.account_id.trim()}
              className="flex items-center gap-1.5 border border-[#333] hover:border-[#555] text-[#888] hover:text-white px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-50"
            >
              {testing ? <Loader2 size={13} className="animate-spin" /> : <ExternalLink size={13} />}
              {testing ? 'Testing…' : 'Test Connection'}
            </button>
            {isConfigured && (
              <button
                onClick={remove}
                disabled={removing}
                className="flex items-center gap-1.5 text-sm text-[#555] hover:text-red-400 transition-colors ml-auto"
              >
                <Trash2 size={13} />
                {removing ? 'Removing…' : 'Remove'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SettingsClient({ savedIntegrations }: Props) {
  const [configs, setConfigs] = useState<Record<string, Record<string, string>>>(
    () => {
      const init: Record<string, Record<string, string>> = {}
      for (const p of PROVIDERS) {
        init[p.id] = savedIntegrations[p.id] ?? {}
      }
      return init
    }
  )
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [removing, setRemoving] = useState<Record<string, boolean>>({})
  const [active, setActive] = useState<Record<string, boolean>>(
    () => {
      const init: Record<string, boolean> = {}
      for (const p of PROVIDERS) {
        init[p.id] = !!savedIntegrations[p.id]
      }
      return init
    }
  )

  const isConfigured = (id: string) =>
    Object.values(savedIntegrations[id] ?? {}).some(v => !!v)

  const saveProvider = async (id: string) => {
    setSaving(prev => ({ ...prev, [id]: true }))
    try {
      await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: id, config: configs[id] }),
      })
      setSaved(prev => ({ ...prev, [id]: true }))
      setTimeout(() => setSaved(prev => ({ ...prev, [id]: false })), 2500)
    } finally {
      setSaving(prev => ({ ...prev, [id]: false }))
    }
  }

  const removeProvider = async (id: string) => {
    setRemoving(prev => ({ ...prev, [id]: true }))
    try {
      await fetch(`/api/integrations?provider=${id}`, { method: 'DELETE' })
      setConfigs(prev => ({ ...prev, [id]: {} }))
      setActive(prev => ({ ...prev, [id]: false }))
    } finally {
      setRemoving(prev => ({ ...prev, [id]: false }))
    }
  }

  const hasAnyKey = (id: string) =>
    Object.values(configs[id] ?? {}).some(v => !!v.trim())

  return (
    <div className="space-y-6">
      {/* Built-in ZiggyDocs */}
      <div className="bg-[#111] border border-[#7c3aed]/40 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7c3aed] flex items-center justify-center shrink-0">
              <PenLine size={18} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold">ZiggyDocs Built-in</h3>
                <span className="text-xs bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30 px-2 py-0.5 rounded-full font-medium">Active</span>
                <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-medium">Recommended</span>
              </div>
              <p className="text-[#888] text-sm mt-1">
                Native e-signature &mdash; included in your Business Suite subscription. No extra cost.
              </p>
            </div>
          </div>
          <CheckCircle size={20} className="text-green-400 shrink-0 mt-0.5" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {['ESIGN Act compliant', 'Audit trail', 'Tamper-evident PDF', 'Mobile signing', 'Sequential signing', 'Bulk send'].map(f => (
            <div key={f} className="flex items-center gap-1.5 text-xs text-[#b3b3b3]">
              <CheckCircle size={11} className="text-[#7c3aed] shrink-0" /> {f}
            </div>
          ))}
        </div>
      </div>

      {/* Zapier Integration */}
      <div>
        <h2 className="text-xs text-[#555] uppercase tracking-widest mb-4">Automation</h2>
        <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ff4a00]/10 border border-[#ff4a00]/20 flex items-center justify-center shrink-0">
                <Zap size={18} className="text-[#ff4a00]" />
              </div>
              <div>
                <h3 className="text-white font-medium">Zapier</h3>
                <p className="text-[#888] text-xs mt-0.5">Connect ZiggyDocs to 6,000+ apps via Zapier webhooks</p>
              </div>
            </div>
            <a
              href="https://zapier.com/developer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#ff4a00] hover:text-[#ff6a30] transition-colors shrink-0 font-medium"
            >
              Connect Zapier <ExternalLink size={12} />
            </a>
          </div>

          <div className="border-t border-[#1a1a1a] px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Triggers */}
            <div>
              <p className="text-xs text-[#555] uppercase tracking-widest mb-3">Triggers</p>
              <ul className="space-y-2">
                {[
                  { event: 'document.sent', label: 'Document Sent' },
                  { event: 'document.viewed', label: 'Document Viewed' },
                  { event: 'document.signed', label: 'Document Signed' },
                  { event: 'document.completed', label: 'Document Completed' },
                  { event: 'document.voided', label: 'Document Voided' },
                ].map(({ event, label }) => (
                  <li key={event} className="flex items-center gap-2 text-sm text-[#b3b3b3]">
                    <CheckCircle size={12} className="text-[#ff4a00] shrink-0" />
                    <span>{label}</span>
                    <code className="ml-auto text-[10px] text-[#555] font-mono">{event}</code>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div>
              <p className="text-xs text-[#555] uppercase tracking-widest mb-3">Actions</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-[#b3b3b3]">
                  <CheckCircle size={12} className="text-[#ff4a00] shrink-0" />
                  <span>Send Document</span>
                </li>
              </ul>
              <div className="mt-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-3 py-2.5">
                <p className="text-[#555] text-xs mb-1">API Key</p>
                <p className="text-[#888] text-xs leading-relaxed">
                  Use your Supabase JWT as a Bearer token when authenticating Zapier action requests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notarization &mdash; Proof.com BYOK */}
      <div>
        <h2 className="text-xs text-[#555] uppercase tracking-widest mb-4">Notarization (Remote Online)</h2>
        <ProofSection savedConfig={savedIntegrations['proof'] ?? {}} />
      </div>

      {/* Third-party BYOK */}
      <div>
        <h2 className="text-xs text-[#555] uppercase tracking-widest mb-4">Bring Your Own Key (Optional)</h2>
        <div className="space-y-4">
          {PROVIDERS.map(p => {
            const configured = isConfigured(p.id)
            const expanded = active[p.id]
            return (
              <div key={p.id} className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden">
                {/* Upsell banner when expanding a competitor key */}
                {expanded && (
                  <div className="flex items-start gap-3 bg-yellow-500/8 border-b border-yellow-500/20 px-5 py-3">
                    <AlertTriangle size={15} className="text-yellow-400 shrink-0 mt-0.5" />
                    <p className="text-yellow-300 text-xs leading-relaxed">
                      <strong>ZiggyDocs is already included in your Business Suite.</strong> Using {p.name} may add extra costs. Switch back to built-in to save.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.logo}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium">{p.name}</h3>
                        {configured && <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">Configured</span>}
                      </div>
                      <p className="text-[#888] text-xs mt-0.5">{p.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActive(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
                    className="text-xs text-[#7c3aed] hover:text-[#a78bfa] transition-colors shrink-0 font-medium"
                  >
                    {expanded ? 'Collapse' : configured ? 'Edit' : 'Configure'}
                  </button>
                </div>

                {expanded && (
                  <div className="px-5 pb-5 space-y-4 border-t border-[#1a1a1a] pt-4">
                    {p.fields.map(f => (
                      <div key={f.key}>
                        <label className="block text-xs text-[#888] uppercase tracking-widest mb-1.5">{f.label}</label>
                        <input
                          type={f.type ?? 'text'}
                          value={configs[p.id]?.[f.key] ?? ''}
                          onChange={e => setConfigs(prev => ({
                            ...prev,
                            [p.id]: { ...prev[p.id], [f.key]: e.target.value },
                          }))}
                          placeholder={f.placeholder}
                          className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-2.5 text-white placeholder-[#555] text-sm focus:outline-none focus:border-[#7c3aed] transition-colors font-mono"
                        />
                      </div>
                    ))}
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        onClick={() => saveProvider(p.id)}
                        disabled={saving[p.id] || !hasAnyKey(p.id)}
                        className="bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                      >
                        {saving[p.id] ? 'Saving…' : saved[p.id] ? '✓ Saved' : 'Save'}
                      </button>
                      {configured && (
                        <button
                          onClick={() => removeProvider(p.id)}
                          disabled={removing[p.id]}
                          className="flex items-center gap-1.5 text-sm text-[#555] hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={13} />
                          {removing[p.id] ? 'Removing…' : 'Remove'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
