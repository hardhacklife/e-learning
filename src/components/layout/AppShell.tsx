import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import type { NavItem } from '@/routes/config/navConfig'

interface AppShellProps {
  title: string
  subtitle?: string
  navItems: NavItem[]
  headerTitle?: string
}

export function AppShell({
  title,
  subtitle,
  navItems,
  headerTitle,
}: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar title={title} subtitle={subtitle} items={navItems} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Header title={headerTitle} />
        <main className="min-h-0 flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
