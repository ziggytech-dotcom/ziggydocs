'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, LayoutTemplate, Settings } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/templates', label: 'Templates', icon: LayoutTemplate },
  { href: '/settings', label: 'Settings', icon: Settings },
]

// Only show on authenticated app routes, not on sign/login/public pages
const AUTH_PREFIXES = ['/dashboard', '/documents', '/templates', '/settings', '/archive', '/bulk-send']

export default function MobileBottomNav() {
  const pathname = usePathname()
  const show = AUTH_PREFIXES.some((p) => pathname.startsWith(p))
  if (!show) return null

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#111] border-t border-[#222] flex items-stretch z-50">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
              isActive ? 'text-[#7c3aed]' : 'text-[#555] hover:text-white'
            }`}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
