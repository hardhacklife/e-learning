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
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar title={title} subtitle={subtitle} items={navItems} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={headerTitle} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
