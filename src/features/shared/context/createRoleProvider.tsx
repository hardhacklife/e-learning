import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { NavItem } from '@/routes/config/navConfig'
import type { UserRole } from '@/types/roles'

export interface RoleContextValue {
  role: UserRole
  sectionTitle: string
  sectionSubtitle?: string
  navItems: NavItem[]
}

export function createRoleProvider(role: UserRole) {
  const Context = createContext<RoleContextValue | null>(null)

  function RoleProvider({
    sectionTitle,
    sectionSubtitle,
    navItems,
    children,
  }: {
    sectionTitle: string
    sectionSubtitle?: string
    navItems: NavItem[]
    children: ReactNode
  }) {
    const value = useMemo(
      () => ({ role, sectionTitle, sectionSubtitle, navItems }),
      [sectionTitle, sectionSubtitle, navItems],
    )

    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  function useRoleContext() {
    const context = useContext(Context)
    if (!context) {
      throw new Error(`useRoleContext doit être utilisé dans un provider ${role}`)
    }
    return context
  }

  return { RoleProvider, useRoleContext, Context }
}
