'use client'
import { useState } from 'react'

export default function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-[#7c3aed] text-xs hover:text-[#a78bfa] transition-colors block"
    >
      {copied ? 'Copied!' : 'Copy link'}
    </button>
  )
}
