import Link from 'next/link'
import { ZiggyDocsLogo } from '@/components/ZiggyDocsLogo'

export function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a] py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <ZiggyDocsLogo size="sm" />
        </div>
        <p className="text-[#555] text-sm">© 2026 ZiggyDocs. Powered by ZiggyTech Business Suite.</p>
        <div className="flex gap-6 text-sm text-[#555]">
          <Link href="/privacy" className="hover:text-[#7c3aed] transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[#7c3aed] transition-colors">Terms of Service</Link>
          <Link href="/cookies" className="hover:text-[#7c3aed] transition-colors">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  )
}
