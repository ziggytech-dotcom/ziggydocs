'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import Script from 'next/script'
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import type { SignField } from '@/components/docsign/FieldPlacementClient'

interface Doc {
  id: string
  title: string
  status: string
  fields_json: SignField[] | null
  signed_at: string | null
  expires_at: string | null
  user_id: string
}

interface Props {
  doc: Doc
  token: string
  recipientName: string
  recipientEmail: string
  recipientSigningOrder?: number
  alreadySigned: boolean
  pdfSignedUrl: string | null
}

type SignMode = 'draw' | 'type'

const FIELD_COLORS: Record<string, string> = {
  signature: '#7c3aed',
  initials: '#8b5cf6',
  date: '#f59e0b',
  text: '#3b82f6',
  name: '#06b6d4',
  checkbox: '#10b981',
}

export default function SigningClient({ doc, token, recipientName, recipientSigningOrder = 1, alreadySigned, pdfSignedUrl }: Props) {
  const allFields: SignField[] = (doc.fields_json as SignField[]) ?? []
  // Only show fields assigned to this recipient (signer_id matches) or unassigned fields (signer_id is undefined/null)
  const fields = allFields.filter(f => f.signer_id == null || f.signer_id === recipientSigningOrder)
  const hasFields = fields.length > 0
  const hasPdf = !!pdfSignedUrl

  const [fieldData, setFieldData] = useState<Record<string, string>>({})
  const [activeField, setActiveField] = useState<SignField | null>(null)
  const [signMode, setSignMode] = useState<SignMode>('draw')
  const [typedName, setTypedName] = useState('')
  const [hasDrawn, setHasDrawn] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [signerName, setSignerName] = useState(recipientName)
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showDeclineModal, setShowDeclineModal] = useState(false)
  const [declineReason, setDeclineReason] = useState('')
  const [declining, setDeclining] = useState(false)
  const [declined, setDeclined] = useState(false)
  const [numPages, setNumPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageImages, setPageImages] = useState<Record<number, string>>({})
  const [pdfLoading, setPdfLoading] = useState(hasPdf)

  const completedCount = fields.filter(f => !!fieldData[f.id]).length
  const allComplete = hasFields ? completedCount === fields.length : true

  useEffect(() => {
    if (!pdfSignedUrl) return
    const load = async () => {
      const pdfjsLib = (window as any).pdfjsLib
      if (!pdfjsLib) { setTimeout(load, 300); return }
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
      try {
        const pdf = await pdfjsLib.getDocument(pdfSignedUrl).promise
        setNumPages(pdf.numPages)
        const imgs: Record<number, string> = {}
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const scale = 1.8
          const viewport = page.getViewport({ scale })
          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height
          const ctx = canvas.getContext('2d')!
          await page.render({ canvasContext: ctx, viewport }).promise
          imgs[i] = canvas.toDataURL()
        }
        setPageImages(imgs)
        setPdfLoading(false)
      } catch { setPdfLoading(false) }
    }
    setTimeout(load, 400)
  }, [pdfSignedUrl])

  const getCtx = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.strokeStyle = '#7c3aed'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    return ctx
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !activeField) return
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
    setHasDrawn(false)
    setTypedName('')
  }, [activeField])

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if ('touches' in e) {
      const t = e.touches[0]
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY }
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }
  }

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = getCtx()
    if (!canvas || !ctx) return
    const { x, y } = getPos(e, canvas)
    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing) return
    const canvas = canvasRef.current
    const ctx = getCtx()
    if (!canvas || !ctx) return
    const { x, y } = getPos(e, canvas)
    ctx.lineTo(x, y)
    ctx.stroke()
    setHasDrawn(true)
  }

  const stopDraw = () => setIsDrawing(false)

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = getCtx()
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
  }

  const getSignatureDataUrl = (): string | null => {
    if (signMode === 'draw') {
      if (!hasDrawn) return null
      return canvasRef.current?.toDataURL('image/png') ?? null
    }
    if (!typedName.trim()) return null
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 120
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#7c3aed'
    ctx.font = 'italic 52px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(typedName, canvas.width / 2, canvas.height / 2)
    return canvas.toDataURL('image/png')
  }

  const confirmField = () => {
    if (!activeField) return
    if (activeField.type === 'date') {
      const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      setFieldData(prev => ({ ...prev, [activeField.id]: today }))
      setActiveField(null)
      return
    }
    if (activeField.type === 'text' || activeField.type === 'name') {
      const val = typedName.trim()
      if (!val) return
      setFieldData(prev => ({ ...prev, [activeField.id]: val }))
      setActiveField(null)
      setTypedName('')
      return
    }
    const dataUrl = getSignatureDataUrl()
    if (!dataUrl) return
    setFieldData(prev => ({ ...prev, [activeField.id]: dataUrl }))
    setActiveField(null)
    clearCanvas()
    setTypedName('')
  }

  const handleFieldClick = (field: SignField) => {
    // Checkbox: toggle directly without modal
    if (field.type === 'checkbox') {
      setFieldData(prev => {
        if (prev[field.id]) { const n = { ...prev }; delete n[field.id]; return n }
        return { ...prev, [field.id]: 'checked' }
      })
      return
    }
    if (fieldData[field.id]) {
      setFieldData(prev => { const n = { ...prev }; delete n[field.id]; return n })
    }
    if (field.type === 'date') {
      const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      setFieldData(prev => ({ ...prev, [field.id]: today }))
      return
    }
    setSignMode('draw')
    setTypedName(field.type === 'name' ? recipientName : '')
    setActiveField(field)
  }

  const handleSubmit = async () => {
    if (!signerName.trim()) { setError('Please enter your full name.'); return }
    if (!agreed) { setError('Please agree to the consent checkbox.'); return }
    if (!allComplete) { setError('Please complete all signature fields.'); return }
    if (!hasFields) { setError('This document has no signature fields configured.'); return }

    setError('')
    setSubmitting(true)
    try {
      const res = await fetch(`/api/sign/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signer_name: signerName,
          signature_data_url: Object.values(fieldData).find(v => v.startsWith('data:')) ?? 'text_only',
          field_data: fieldData,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Signing failed')
      }
      setSuccess(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDecline = async () => {
    if (!declineReason.trim()) return
    setDeclining(true)
    try {
      const res = await fetch(`/api/sign/${token}/decline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decline_reason: declineReason.trim() }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to decline')
      }
      setShowDeclineModal(false)
      setDeclined(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setDeclining(false)
    }
  }

  if (alreadySigned) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-[#111] border border-[#222] rounded-2xl p-8 text-center space-y-4">
          <CheckCircle size={40} className="text-green-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Already Signed</h2>
          <p className="text-[#b3b3b3]">This document has already been signed.</p>
        </div>
      </div>
    )
  }

  if (declined) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-[#111] border border-[#222] rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto">
            <span className="text-orange-400 text-2xl font-bold">✕</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Signing Declined</h2>
          <p className="text-[#b3b3b3]">You have declined to sign this document. The sender has been notified.</p>
        </div>
      </div>
    )
  }

  if (doc.expires_at && new Date(doc.expires_at) < new Date()) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-[#111] border border-[#222] rounded-2xl p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Link Expired</h2>
          <p className="text-[#b3b3b3]">This signing link has expired. Please request a new one.</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-[#111] border border-[#222] rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Document Signed Successfully</h2>
          <p className="text-[#b3b3b3]">A confirmation has been sent to all parties. You may close this window.</p>
        </div>
      </div>
    )
  }

  const pageFieldsForCurrent = fields.filter(f => f.page === currentPage)

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" strategy="afterInteractive" />
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Progress */}
        {hasFields && (
          <div className="bg-[#111] border border-[#222] rounded-xl px-4 sm:px-5 py-3 sm:py-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white text-sm font-medium">
                {completedCount === fields.length ? '✓ All fields completed' : `${completedCount} / ${fields.length} fields`}
              </p>
              <p className="text-[#b3b3b3] text-xs">{fields.length - completedCount} left</p>
            </div>
            <div className="h-2 bg-[#222] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${fields.length > 0 ? (completedCount / fields.length) * 100 : 0}%`, background: completedCount === fields.length ? '#22c55e' : '#7c3aed' }}
              />
            </div>
          </div>
        )}

        {/* PDF Viewer */}
        {hasPdf && (
          <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#222] flex items-center justify-between">
              <p className="text-[#b3b3b3] text-xs uppercase tracking-widest">Document</p>
              {numPages > 1 && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-[#b3b3b3] hover:text-white hover:bg-[#222] disabled:opacity-30 transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-[#b3b3b3] text-xs px-1">{currentPage} / {numPages}</span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
                    disabled={currentPage === numPages}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-[#b3b3b3] hover:text-white hover:bg-[#222] disabled:opacity-30 transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
            {/* Horizontally scrollable on narrow screens */}
            <div className="overflow-x-auto">
              <div className="p-3 sm:p-4 min-w-full">
                {pdfLoading ? (
                  <div className="flex items-center justify-center py-16 text-[#555] text-sm">Loading PDF…</div>
                ) : (
                  <div className="relative mx-auto" style={{ maxWidth: '700px', minWidth: '300px' }}>
                    {pageImages[currentPage] ? (
                      <img src={pageImages[currentPage]} alt={`Page ${currentPage}`} className="w-full rounded shadow-xl" draggable={false} />
                    ) : (
                      <div className="w-full bg-white rounded" style={{ aspectRatio: '8.5/11' }} />
                    )}
                    {pageFieldsForCurrent.map(field => {
                      const completed = !!fieldData[field.id]
                      const color = FIELD_COLORS[field.type]
                      return (
                        <div
                          key={field.id}
                          onClick={() => handleFieldClick(field)}
                          className="absolute flex items-center justify-center rounded cursor-pointer transition-all active:scale-95"
                          style={{
                            left: `${field.x}%`,
                            top: `${field.y}%`,
                            width: `${field.width}%`,
                            height: `${field.height}%`,
                            minWidth: '44px',
                            minHeight: '44px',
                            background: completed ? color + '22' : color + '15',
                            border: `2px solid ${completed ? color : color + '88'}`,
                            zIndex: 10,
                          }}
                        >
                          {completed ? (
                            field.type === 'signature' || field.type === 'initials' ? (
                              <img src={fieldData[field.id]} alt="signature" className="w-full h-full object-contain p-0.5" draggable={false} />
                            ) : field.type === 'checkbox' ? (
                              <span className="text-white text-lg font-bold">✓</span>
                            ) : (
                              <span className="text-white text-xs font-medium px-1 truncate">{fieldData[field.id]}</span>
                            )
                          ) : field.type === 'checkbox' ? (
                            <div className="w-4 h-4 border-2 rounded" style={{ borderColor: color }} />
                          ) : (
                            <span className="text-xs font-medium px-1 animate-pulse" style={{ color }}>{field.label}</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
            {numPages > 1 && (
              <div className="border-t border-[#222] px-4 py-3 flex justify-center gap-2 flex-wrap">
                {Array.from({ length: numPages }, (_, i) => i + 1).map(p => {
                  const done = fields.filter(f => f.page === p && !!fieldData[f.id]).length
                  const total = fields.filter(f => f.page === p).length
                  return (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors relative ${currentPage === p ? 'bg-[#7c3aed] text-white' : 'bg-[#1a1a1a] text-[#b3b3b3] hover:text-white border border-[#333]'}`}
                    >
                      {p}
                      {total > 0 && done === total && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-500" />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Confirm & Sign */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5">
          <h3 className="text-lg text-white font-medium">Confirm & Sign</h3>
          <div>
            <label className="block text-[#b3b3b3] text-xs uppercase tracking-widest mb-2">Full Legal Name *</label>
            <input
              type="text"
              value={signerName}
              onChange={e => setSignerName(e.target.value)}
              placeholder="Your full legal name"
              className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-4 py-3 text-white text-base placeholder-[#555] focus:outline-none focus:border-[#7c3aed] transition-colors"
            />
          </div>
          {!hasFields && (
            <p className="text-[#b3b3b3] text-sm bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3">
              No signature fields have been configured for this document yet.
            </p>
          )}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-0.5 w-5 h-5 cursor-pointer shrink-0 accent-[#7c3aed]"
            />
            <span className="text-[#b3b3b3] text-sm leading-relaxed">
              I agree to sign this document electronically. I understand my electronic signature is legally binding under the ESIGN Act.
            </span>
          </label>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={submitting || !allComplete || !hasFields}
            className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] active:bg-[#5b21b6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 rounded-xl transition-colors text-base"
          >
            {submitting ? 'Signing…' : allComplete && hasFields ? 'Submit Signed Document' : `Complete ${fields.length - completedCount} remaining field${fields.length - completedCount !== 1 ? 's' : ''}`}
          </button>
          <p className="text-[#555] text-xs text-center leading-relaxed">
            Not valid for wills, adoption, court orders, or negotiable instruments.
          </p>
          <div className="pt-2 border-t border-[#1a1a1a] text-center">
            <button
              onClick={() => { setShowDeclineModal(true); setDeclineReason('') }}
              className="text-sm text-[#555] hover:text-red-400 transition-colors py-1"
            >
              Decline to sign
            </button>
          </div>
        </div>
      </div>

      {/* Decline modal — slides up from bottom on mobile */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 p-0 sm:p-4">
          <div className="bg-[#111] border border-[#222] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-[#222]">
              <h3 className="text-white font-medium">Decline to Sign</h3>
              <button onClick={() => setShowDeclineModal(false)} className="w-9 h-9 flex items-center justify-center rounded-lg text-[#555] hover:text-white hover:bg-[#222] transition-colors text-xl leading-none">×</button>
            </div>
            <div className="p-5 space-y-4 pb-8 sm:pb-5">
              <p className="text-[#b3b3b3] text-sm">Please provide a reason for declining. This will be sent to the document sender.</p>
              <div>
                <label className="block text-xs text-[#888] uppercase tracking-widest mb-2">Reason *</label>
                <textarea
                  value={declineReason}
                  onChange={e => setDeclineReason(e.target.value)}
                  placeholder="e.g. I do not agree with the terms in section 3…"
                  rows={4}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-[#444] focus:outline-none focus:border-red-500/50 transition-colors resize-none text-base"
                  autoFocus
                />
              </div>
              <button
                onClick={handleDecline}
                disabled={declining || !declineReason.trim()}
                className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 rounded-xl transition-colors text-base"
              >
                {declining ? 'Declining…' : 'Confirm Decline'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signature modal — slides up from bottom on mobile */}
      {activeField && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 p-0 sm:p-4">
          <div className="bg-[#111] border border-[#222] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-[#222]">
              <h3 className="text-white font-medium">
                {activeField.type === 'text' ? 'Enter Text' : activeField.type === 'name' ? 'Enter Name' : activeField.type === 'initials' ? 'Add Initials' : 'Sign Here'}
              </h3>
              <button onClick={() => setActiveField(null)} className="w-9 h-9 flex items-center justify-center rounded-lg text-[#555] hover:text-white hover:bg-[#222] transition-colors text-xl leading-none">×</button>
            </div>
            <div className="p-5 space-y-4 pb-8 sm:pb-5">
              {(activeField.type === 'signature' || activeField.type === 'initials') && (
                <>
                  <div className="flex gap-2">
                    <button onClick={() => setSignMode('draw')} className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${signMode === 'draw' ? 'bg-[#7c3aed] text-white' : 'bg-[#0a0a0a] border border-[#333] text-[#b3b3b3]'}`}>Draw</button>
                    <button onClick={() => setSignMode('type')} className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${signMode === 'type' ? 'bg-[#7c3aed] text-white' : 'bg-[#0a0a0a] border border-[#333] text-[#b3b3b3]'}`}>Type</button>
                  </div>
                  {signMode === 'draw' ? (
                    <div>
                      <div className="relative rounded-lg border border-[#333] bg-[#0a0a0a] overflow-hidden" style={{ height: '160px' }}>
                        <canvas
                          ref={canvasRef}
                          className="w-full h-full cursor-crosshair touch-none"
                          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
                        />
                        {!hasDrawn && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><p className="text-[#444] text-sm">Draw your {activeField.type} here</p></div>}
                      </div>
                      <button onClick={clearCanvas} className="mt-2 text-xs text-[#555] hover:text-white transition-colors py-1">Clear</button>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={typedName}
                      onChange={e => setTypedName(e.target.value)}
                      placeholder={activeField.type === 'initials' ? 'Your initials' : 'Type your name'}
                      className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-4 text-[#7c3aed] placeholder-[#444] focus:outline-none focus:border-[#7c3aed]"
                      style={{ fontStyle: 'italic', fontSize: '1.25rem', fontFamily: 'Georgia, serif' }}
                      autoFocus
                    />
                  )}
                </>
              )}
              {(activeField.type === 'text' || activeField.type === 'name') && (
                <input
                  type="text"
                  value={typedName}
                  onChange={e => setTypedName(e.target.value)}
                  placeholder={activeField.type === 'name' ? 'Your full name' : activeField.label}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-4 text-white placeholder-[#444] focus:outline-none focus:border-[#7c3aed] transition-colors text-base"
                  autoFocus
                />
              )}
              <button
                onClick={confirmField}
                disabled={(activeField.type === 'signature' || activeField.type === 'initials') ? (signMode === 'draw' ? !hasDrawn : !typedName.trim()) : !typedName.trim()}
                className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] active:bg-[#5b21b6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 rounded-xl transition-colors text-base"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
