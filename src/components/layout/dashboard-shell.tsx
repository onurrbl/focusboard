'use client'

import { usePathname } from 'next/navigation'
import { AppSidebar } from '@/components/layout/app-sidebar'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar pathname={pathname} />
      <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
    </div>
  )
}
