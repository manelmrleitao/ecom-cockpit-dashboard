/**
 * Layout do Dashboard
 */

'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const mainNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/analytics', label: 'Análise Detalhada', icon: '📈' },
  ]

  const settingsItems = [
    { href: '/dashboard/settings', label: 'Configurações', icon: '⚙️' },
  ]

  const isActivePath = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white flex flex-col">
        <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-4">
          <div className="text-2xl font-bold text-blue-600">🚀</div>
          <div>
            <span className="font-bold text-gray-900 block">Ecom Cockpit</span>
            <span className="text-xs text-gray-500">Analytics Dashboard</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
          {/* Principal */}
          {mainNavItems.map((item) => {
            const isActive = isActivePath(item.href)
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            )
          })}
        </nav>

        {/* Settings - Bottom */}
        <div className="border-t border-gray-200 px-4 py-4 space-y-1">
          {settingsItems.map((item) => {
            const isActive = isActivePath(item.href)
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            )
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <p className="text-xs text-gray-600">
            Desenvolvido com <span className="text-red-500">❤️</span> usando Next.js
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-8 py-8">{children}</div>
      </main>
    </div>
  )
}
