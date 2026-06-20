import { Outlet, useLocation } from 'react-router-dom'
import { TrainerNavbar } from '@/components/layout/TrainerNavbar'
import type { NavItem } from '@/routes/config/navConfig'
import { cn } from '@/lib/utils'

interface TrainerShellProps {
  navItems: NavItem[]
}

export function TrainerShell({ navItems }: TrainerShellProps) {
  const { pathname } = useLocation()
  const isWideLayout =
    pathname.includes('/emploi-du-temps') ||
    pathname.includes('/students') ||
    pathname.includes('/bulletins') ||
    pathname.includes('/notifications') ||
    (pathname.includes('/formations') && !pathname.includes('/quiz'))

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <TrainerNavbar items={navItems} />
      <main
        className={cn(
          'mx-auto min-h-0 w-full flex-1 overflow-y-auto px-4 py-4 sm:px-6',
          isWideLayout ? 'max-w-5xl' : 'max-w-3xl',
        )}
      >
        <Outlet />
      </main>
    </div>
  )
}
