import { Outlet, useLocation } from 'react-router-dom'
import { StudentNavbar } from '@/components/layout/StudentNavbar'
import type { NavItem } from '@/routes/config/navConfig'
import { cn } from '@/lib/utils'

interface StudentShellProps {
  navItems: NavItem[]
}

export function StudentShell({ navItems }: StudentShellProps) {
  const { pathname } = useLocation()
  const isWideLayout =
    pathname.includes('/emploi-du-temps') ||
    (pathname.includes('/formations') && !pathname.includes('/quiz'))

  return (
    <div className="min-h-screen bg-slate-50">
      <StudentNavbar items={navItems} />
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
