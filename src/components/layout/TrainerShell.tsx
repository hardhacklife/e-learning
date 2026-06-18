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
    (pathname.includes('/formations') && !pathname.includes('/quiz'))

  return (
    <div className="min-h-screen bg-slate-50">
      <TrainerNavbar items={navItems} />
      <main
        className={cn(
          'mx-auto w-full px-4 py-4 sm:px-6',
          isWideLayout ? 'max-w-5xl' : 'max-w-3xl',
        )}
      >
        <Outlet />
      </main>
    </div>
  )
}
