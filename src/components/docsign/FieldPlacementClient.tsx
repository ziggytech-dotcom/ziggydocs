'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Script from 'next/script'
import { ArrowLeft, Save, Trash2, PenLine, Type, Calendar, AlignLeft, CheckSquare, User, ChevronLeft, ChevronRight } from 'lucide-react'

export interface SignField {
  id: string
  type: 'signature' | 'initials' | 'date' | 'text' | 'name' | 'checkbox'
  page: number
  x: number
  y: number
  width: number
  height: number
  label: string
  signer_id?: number // signing_order of the assigned recipient; undefined = all signers
}

export interface Recipient {
  id: string
  name: string
  email: string
  signing_order: number
}

interface Doc {
  id: string
  title: string
  file_url: string | null
  fields_json: SignField[] | null
  status: string
  clients: { name: string } | null
}

interface Props {
  doc: Doc
  pdfSignedUrl: string | null
  backHref?: string
  saveEndpoint?: string
  recipients?: Recipient[]
}

const FIELD_TYPES = [
  { type: 'signature' as const, label: 'Signature', icon: PenLine, color: '#7c3aed' },
  { type: 'initials' as const, label: 'Initials', icon: Type, color: '#8b5cf6' },
  { type: 'date' as const, label: 'Date', icon: Calendar, color: '#f59e0b' },
  { type: 'text' as const, label: 'Text', icon: AlignLeft, color: '#3b82f6' },
  { type: 'name' as const, label: 'Name', icon: User, color: '#06b6d4' },
  { type: 'checkbox' as const, label: 'Checkbox', icon: CheckSquare, color: '#10b981' },
]

const FIELD_DEFAULTS: Record<SignField['type'], { width: number; height: number; label: string }> = {
  signature: { width: 24, height: 8, label: 'Signature' },
  initials: { width: 12, height: 6, label: 'Initials' },
  date: { width: 18, height: 5, label: 'Date' },
  text: { width: 22, height: 5, label: 'Text Field' },
  name: { width: 22, height: 5, label: 'Full Name' },
  checkbox: { width: 5, height: 5, label: 'Checkbox' },
}

export const FIELD_COLORS: Record<string, string> = {
  signature: '#7c3aed',
  initials: '#8b5cf6',
  date: '#f59e0b',
  text: '#3b82f6',
  name: '#06b6d4',
  checkbox: '#10b981',
}

const SIGNER_COLORS = ['#7c3aed', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#ec4899']

export default function FieldPlacementClient({ doc, pdfSignedUrl, backHref = '/dashboard', saveEndpoint, recipients = [] }: Props) {
  const [fields, setFields] = useState<SignField[]>((doc.fields_json as SignField[]) ?? [])
  const [activeTool, setActiveTool] = useState<SignField['type'] | null>(null)
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [numPages, setNumPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageUrl, setPageUrl] = useState<string | null>(pdfSignedUrl)
  const [activeSigner, setActiveSigner] = useState<number | null>(
    recipients.length > 0 ? recipients[0].signing_order : null
  )

  const dragging = useRef<{ fieldId: string; startX: number; startY: number; origX: number; origY: number } | null>(null)
  const resizing = useRef<{ fieldId: string; startX: number; startY: number; origW: number; origH: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const pdfRef = useRef<any>(null)

  useEffect(() => {
    if (!pdfSignedUrl) return
    const load = async () => {
      const pdfjsLib = (window as any).pdfjsLib
      if (!pdfjsLib) { setTimeout(load, 300); return }
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
      try {
        const pdf = await pdfjsLib.getDocument(pdfSignedUrl).promise
        pdfRef.current = pdf
        setNumPages(pdf.numPages)
        renderPage(pdf, 1)
      } catch { /* ignore */ }
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfSignedUrl])

  const renderPage = async (pdf: any, pageNum: number) => {
    try {
      const page = await pdf.getPage(pageNum)
      const scale = 1.5
      const viewport = page.getViewport({ scale })
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      const ctx = canvas.getContext('2d')!
      await page.render({ canvasContext: ctx, viewport }).promise
      setPageUrl(canvas.toDataURL())
    } catch { /* ignore */ }
  }

  const changePage = useCallback(async (num: number) => {
    setCurrentPage(num)
    if (!pdfSignedUrl) return
    try {
      const pdf = pdfRef.current
      if (!pdf) return
      renderPage(pdf, num)
    } catch { /* ignore */ }
  }, [pdfSignedUrl])

  const getFieldBorderColor = (field: SignField) => {
    if (field.signer_id != null && recipients.length > 0) {
      const idx = recipients.findIndex(r => r.signing_order === field.signer_id)
      if (idx !== -1) return SIGNER_COLORS[idx % SIGNER_COLORS.length]
    }
    return FIELD_COLORS[field.type]
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeTool) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    const defaults = FIELD_DEFAULTS[activeTool]
    const newField: SignField = {
      id: crypto.randomUUID(),
      type: activeTool,
      page: currentPage,
      x: Math.max(0, Math.min(x - defaults.width / 2, 100 - defaults.width)),
      y: Math.max(0, Math.min(y - defaults.height / 2, 100 - defaults.height)),
      width: defaults.width,
      height: defaults.height,
      label: defaults.label,
      signer_id: activeSigner ?? undefined,
    }
    setFields(prev => [...prev, newField])
    setSelectedField(newField.id)
  }

  const startDrag = (e: React.MouseEvent, fieldId: string) => {
    e.stopPropagation()
    const field = fields.find(f => f.id === fieldId)
    if (!field) return
    setSelectedField(fieldId)
    dragging.current = { fieldId, startX: e.clientX, startY: e.clientY, origX: field.x, origY: field.y }
  }

  const startResize = (e: React.MouseEvent, fieldId: string) => {
    e.stopPropagation()
    e.preventDefault()
    const field = fields.find(f => f.id === fieldId)
    if (!field) return
    resizing.current = { fieldId, startX: e.clientX, startY: e.clientY, origW: field.width, origH: field.height }
  }

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    if (resizing.current) {
      const dw = ((e.clientX - resizing.current.startX) / rect.width) * 100
      const dh = ((e.clientY - resizing.current.startY) / rect.height) * 100
      setFields(prev => prev.map(f => {
        if (f.id !== resizing.current!.fieldId) return f
        return { ...f, width: Math.max(6, resizing.current!.origW + dw), height: Math.max(4, resizing.current!.origH + dh) }
      }))
      return
    }
    if (!dragging.current) return
    const dx = ((e.clientX - dragging.current.startX) / rect.width) * 100
    const dy = ((e.clientY - dragging.current.startY) / rect.height) * 100
    setFields(prev => prev.map(f => {
      if (f.id !== dragging.current!.fieldId) return f
      return {
        ...f,
        x: Math.max(0, Math.min(dragging.current!.origX + dx, 100 - f.width)),
        y: Math.max(0, Math.min(dragging.current!.origY + dy, 100 - f.height)),
      }
    }))
  }

  const stopDrag = () => { dragging.current = null; resizing.current = null }

  const deleteField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id))
    if (selectedField === id) setSelectedField(null)
  }

  const updateFieldLabel = (id: string, label: string) =>
    setFields(prev => prev.map(f => f.id === id ? { ...f, label } : f))

  const updateFieldSigner = (id: string, signer_id: number | undefined) =>
    setFields(prev => prev.map(f => f.id === id ? { ...f, signer_id } : f))

  const save = async () => {
    setSaving(true)
    const endpoint = saveEndpoint ?? `/api/documents/${doc.id}/fields`
    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields_json: fields }),
      })
      if (!res.ok) throw new Error('Save failed')
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch { /* ignore */ }
    finally { setSaving(false) }
  }

  const pageFields = fields.filter(f => f.page === currentPage)
  const selectedFieldObj = fields.find(f => f.id === selectedField) ?? null

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" strategy="afterInteractive" />
      <div className="flex flex-col h-screen bg-[#0a0a0a]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#222] bg-[#111] shrink-0 gap-3">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <a href={backHref} className="flex items-center gap-2 text-[#b3b3b3] hover:text-white transition-colors text-sm shrink-0">
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </a>
            <div className="min-w-0">
              <h1 className="text-white font-medium text-sm truncate">{doc.title}</h1>
              <p className="text-[#555] text-xs">Place signature fields</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {FIELD_TYPES.map(ft => (
              <button
                key={ft.type}
                onClick={() => setActiveTool(prev => prev === ft.type ? null : ft.type)}
                className={`flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-lg text-xs font-medium transition-all border ${activeTool === ft.type ? 'text-white border-transparent' : 'text-[#b3b3b3] border-[#333] hover:border-[#555] hover:text-white'}`}
                style={activeTool === ft.type ? { background: ft.color, borderColor: ft.color } : {}}
                title={`Add ${ft.label} field`}
              >
                <ft.icon size={13} />
                <span className="hidden lg:inline">{ft.label}</span>
              </button>
            ))}
            <div className="w-px h-6 bg-[#333]" />
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              <Save size={14} />
              <span className="hidden sm:inline">{saving ? 'Saving…' : saved ? 'Saved!' : 'Save Fields'}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* PDF canvas area */}
          <div className="flex-1 overflow-auto flex flex-col items-center p-4 sm:p-6">
            {/* Signer tabs */}
            {recipients.length > 1 && (
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-[#555] text-xs">Placing for:</span>
                <button
                  onClick={() => setActiveSigner(null)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${activeSigner === null ? 'bg-[#333] border-[#555] text-white' : 'border-[#333] text-[#888] hover:text-white'}`}
                >
                  All
                </button>
                {recipients.map((r, idx) => (
                  <button
                    key={r.id}
                    onClick={() => setActiveSigner(r.signing_order)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${activeSigner === r.signing_order ? 'text-white border-transparent' : 'border-[#333] text-[#888] hover:text-white'}`}
                    style={activeSigner === r.signing_order ? { background: SIGNER_COLORS[idx % SIGNER_COLORS.length] } : {}}
                  >
                    {r.name || r.email}
                  </button>
                ))}
              </div>
            )}

            {activeTool && (
              <div
                className="mb-3 px-4 py-2 rounded-xl text-sm text-white"
                style={{ background: FIELD_COLORS[activeTool] + '33', border: `1px solid ${FIELD_COLORS[activeTool]}55` }}
              >
                Click to place a <strong>{activeTool}</strong> field
                {activeSigner != null && recipients.length > 0 && (
                  <> for <strong>{recipients.find(r => r.signing_order === activeSigner)?.name ?? `Signer ${activeSigner}`}</strong></>
                )}
                . Click tool again to deselect.
              </div>
            )}

            {numPages > 1 && (
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => changePage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-[#333] text-[#b3b3b3] hover:text-white disabled:opacity-30 transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-[#b3b3b3] text-sm">Page {currentPage} of {numPages}</span>
                <button
                  onClick={() => changePage(Math.min(numPages, currentPage + 1))}
                  disabled={currentPage === numPages}
                  className="p-1.5 rounded-lg border border-[#333] text-[#b3b3b3] hover:text-white disabled:opacity-30 transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            <div
              ref={containerRef}
              className="relative select-none"
              style={{ cursor: activeTool ? 'crosshair' : 'default', maxWidth: '750px', width: '100%' }}
              onClick={handleCanvasClick}
              onMouseMove={onMouseMove}
              onMouseUp={stopDrag}
              onMouseLeave={stopDrag}
            >
              {pageUrl ? (
                <img
                  src={pageUrl}
                  alt={`Page ${currentPage}`}
                  className="w-full rounded-lg shadow-2xl border border-[#333]"
                  draggable={false}
                />
              ) : (
                <div className="w-full bg-white rounded-lg shadow-2xl" style={{ aspectRatio: '8.5/11' }}>
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    {doc.file_url ? 'Loading PDF…' : 'No PDF uploaded.'}
                  </div>
                </div>
              )}

              {pageFields.map(field => {
                const borderColor = getFieldBorderColor(field)
                return (
                  <div
                    key={field.id}
                    onMouseDown={e => startDrag(e, field.id)}
                    onClick={e => { e.stopPropagation(); setSelectedField(field.id) }}
                    className="absolute flex items-center justify-center rounded text-xs font-medium transition-all"
                    style={{
                      left: `${field.x}%`,
                      top: `${field.y}%`,
                      width: `${field.width}%`,
                      height: `${field.height}%`,
                      background: borderColor + '22',
                      border: `2px solid ${borderColor}`,
                      color: borderColor,
                      cursor: 'move',
                      zIndex: selectedField === field.id ? 20 : 10,
                      boxShadow: selectedField === field.id ? `0 0 0 2px ${borderColor}55` : 'none',
                    }}
                  >
                    {field.type === 'checkbox' ? (
                      <div className="w-4 h-4 border-2 rounded" style={{ borderColor }} />
                    ) : (
                      <span className="truncate px-1">{field.label}</span>
                    )}
                    {selectedField === field.id && (
                      <>
                        <button
                          onMouseDown={e => e.stopPropagation()}
                          onClick={e => { e.stopPropagation(); deleteField(field.id) }}
                          className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white"
                          style={{ zIndex: 30 }}
                          aria-label="Delete field"
                        >
                          <Trash2 size={10} />
                        </button>
                        <div
                          onMouseDown={e => startResize(e, field.id)}
                          className="absolute bottom-0 right-0 w-3 h-3 rounded-tl"
                          style={{ background: borderColor, cursor: 'se-resize', zIndex: 30 }}
                        />
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="w-56 xl:w-64 border-l border-[#222] bg-[#111] overflow-y-auto shrink-0 flex flex-col">
            {/* Properties panel */}
            <div className="p-4 border-b border-[#222]">
              <h3 className="text-[#b3b3b3] text-xs uppercase tracking-widest mb-3">
                {selectedFieldObj ? 'Field Properties' : 'Properties'}
              </h3>
              {selectedFieldObj ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[#555] text-xs mb-1">Label</label>
                    <input
                      type="text"
                      value={selectedFieldObj.label}
                      onChange={e => updateFieldLabel(selectedFieldObj.id, e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-[#7c3aed]"
                    />
                  </div>
                  <div className="flex gap-3">
                    <div>
                      <label className="block text-[#555] text-xs mb-1">Type</label>
                      <p className="text-white text-xs capitalize">{selectedFieldObj.type}</p>
                    </div>
                    <div>
                      <label className="block text-[#555] text-xs mb-1">Page</label>
                      <p className="text-white text-xs">{selectedFieldObj.page}</p>
                    </div>
                  </div>
                  {recipients.length > 0 && (
                    <div>
                      <label className="block text-[#555] text-xs mb-1">Assigned to</label>
                      <select
                        value={selectedFieldObj.signer_id ?? ''}
                        onChange={e => updateFieldSigner(selectedFieldObj.id, e.target.value ? Number(e.target.value) : undefined)}
                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-[#7c3aed]"
                      >
                        <option value="">All signers</option>
                        {recipients.map(r => (
                          <option key={r.id} value={r.signing_order}>
                            {r.name || r.email}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <button
                    onClick={() => deleteField(selectedFieldObj.id)}
                    className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 size={11} /> Delete field
                  </button>
                </div>
              ) : (
                <p className="text-[#555] text-xs">Click a field to edit its properties.</p>
              )}
            </div>

            {/* Field list */}
            <div className="p-4 flex-1">
              <h3 className="text-[#b3b3b3] text-xs uppercase tracking-widest mb-3">All Fields ({fields.length})</h3>
              {fields.length === 0
                ? <p className="text-[#555] text-xs">No fields placed yet.</p>
                : (
                  <div className="space-y-2">
                    {fields.map((field, idx) => {
                      const borderColor = getFieldBorderColor(field)
                      const signerName = field.signer_id != null
                        ? (recipients.find(r => r.signing_order === field.signer_id)?.name ?? `Signer ${field.signer_id}`)
                        : null
                      return (
                        <div
                          key={field.id}
                          onClick={() => { changePage(field.page); setSelectedField(field.id) }}
                          className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors text-xs ${selectedField === field.id ? 'bg-[#1a1a1a] border border-[#333]' : 'hover:bg-[#1a1a1a] border border-transparent'}`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: borderColor }} />
                            <div className="min-w-0">
                              <p className="text-white truncate">{field.label}</p>
                              <p className="text-[#555]">Pg {field.page}{signerName ? ` &middot; ${signerName}` : ''}</p>
                            </div>
                          </div>
                          <span className="text-[#555] shrink-0 ml-1">{idx + 1}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
