import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export interface SignatureField {
  id: string
  type: 'signature' | 'initials' | 'date' | 'text' | 'name' | 'checkbox'
  page: number
  x: number
  y: number
  width: number
  height: number
  label: string
}

export interface SignerRecord {
  name: string
  email: string
  signed_at: string | null
  ip_address?: string | null
  declined_at?: string | null
}

interface EmbedOptions {
  pdfBytes: Uint8Array
  fields: SignatureField[]
  fieldData: Record<string, string>
  signerName: string
  signerIp: string
  documentId: string
  documentTitle: string
  signedAt: string
  auditEvents: Array<{ event: string; created_at: string; ip_address?: string }>
  allSigners?: SignerRecord[]
}

export async function generateSignedPdf(opts: EmbedOptions): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(opts.pdfBytes)
  const pages = pdfDoc.getPages()
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  for (const field of opts.fields) {
    const pageIndex = field.page - 1
    if (pageIndex < 0 || pageIndex >= pages.length) continue
    const page = pages[pageIndex]
    const { width: pw, height: ph } = page.getSize()

    const x = (field.x / 100) * pw
    const y = ph - ((field.y + field.height) / 100) * ph
    const w = (field.width / 100) * pw
    const h = (field.height / 100) * ph

    const value = opts.fieldData[field.id]
    if (!value) continue

    if (field.type === 'signature' || field.type === 'initials') {
      if (value.startsWith('data:image/png')) {
        const base64 = value.replace('data:image/png;base64,', '')
        const imgBytes = Buffer.from(base64, 'base64')
        const img = await pdfDoc.embedPng(imgBytes)
        page.drawImage(img, { x, y, width: w, height: h })
      }
    } else {
      const fontSize = Math.min(h * 0.55, 12)
      page.drawText(value, {
        x: x + 4,
        y: y + (h - fontSize) / 2,
        size: fontSize,
        font: helvetica,
        color: rgb(0.1, 0.1, 0.1),
        maxWidth: w - 8,
      })
    }
  }

  // Certificate page
  const certPage = pdfDoc.addPage([612, 792])
  const { width, height } = certPage.getSize()
  const margin = 50
  let yPos = height - margin

  certPage.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: rgb(0.067, 0.067, 0.067) })
  certPage.drawText('DOCUMENT COMPLETION CERTIFICATE', {
    x: margin, y: height - 48, size: 14, font: helveticaBold, color: rgb(0.486, 0.231, 0.929),
  })
  certPage.drawText('ZiggyDocs — Secure Electronic Signing', {
    x: margin, y: height - 65, size: 9, font: helvetica, color: rgb(0.4, 0.4, 0.4),
  })

  yPos = height - 110

  const drawRow = (label: string, value: string) => {
    certPage.drawText(label, { x: margin, y: yPos, size: 9, font: helveticaBold, color: rgb(0.5, 0.5, 0.5) })
    certPage.drawText(value, { x: margin + 130, y: yPos, size: 9, font: helvetica, color: rgb(0.1, 0.1, 0.1) })
    yPos -= 18
  }

  const drawSectionHeader = (text: string) => {
    yPos -= 8
    certPage.drawRectangle({ x: margin - 4, y: yPos - 4, width: width - margin * 2 + 8, height: 18, color: rgb(0.95, 0.95, 0.95) })
    certPage.drawText(text, { x: margin, y: yPos, size: 9, font: helveticaBold, color: rgb(0.3, 0.3, 0.3) })
    yPos -= 22
  }

  drawSectionHeader('DOCUMENT INFORMATION')
  drawRow('Document Title:', opts.documentTitle)
  drawRow('Document ID:', opts.documentId)
  drawRow('Signed At:', opts.signedAt)

  drawSectionHeader('SIGNER INFORMATION')
  if (opts.allSigners && opts.allSigners.length > 0) {
    for (const signer of opts.allSigners) {
      const ts = signer.signed_at
        ? new Date(signer.signed_at).toLocaleString('en-US', { timeZone: 'America/New_York' }) + ' ET'
        : '—'
      const ip = signer.ip_address ?? 'unknown'
      certPage.drawText(`${signer.name} <${signer.email}>`, {
        x: margin, y: yPos, size: 9, font: helveticaBold, color: rgb(0.1, 0.1, 0.1),
      })
      yPos -= 14
      certPage.drawText(`Signed: ${ts}  ·  IP: ${ip}`, {
        x: margin + 10, y: yPos, size: 8, font: helvetica, color: rgb(0.4, 0.4, 0.4),
      })
      yPos -= 18
      if (yPos < 120) break
    }
  } else {
    drawRow('Signer Name:', opts.signerName)
    drawRow('IP Address:', opts.signerIp)
  }

  drawSectionHeader('AUDIT TRAIL')
  for (const event of opts.auditEvents) {
    const label = event.event.replace(/_/g, ' ').toUpperCase()
    const ts = new Date(event.created_at).toLocaleString('en-US')
    const ipStr = event.ip_address ? ` — ${event.ip_address}` : ''
    certPage.drawText(label, { x: margin, y: yPos, size: 8, font: helveticaBold, color: rgb(0.3, 0.3, 0.3) })
    certPage.drawText(`${ts}${ipStr}`, { x: margin + 130, y: yPos, size: 8, font: helvetica, color: rgb(0.4, 0.4, 0.4) })
    yPos -= 16
    if (yPos < 80) break
  }

  certPage.drawLine({ start: { x: margin, y: 70 }, end: { x: width - margin, y: 70 }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) })
  certPage.drawText('This certificate is appended automatically by ZiggyDocs upon document completion.', {
    x: margin, y: 55, size: 7, font: helvetica, color: rgb(0.6, 0.6, 0.6),
  })
  certPage.drawText(`Generated: ${new Date().toISOString()}`, {
    x: margin, y: 43, size: 7, font: helvetica, color: rgb(0.6, 0.6, 0.6),
  })

  return pdfDoc.save()
}
