import { AppShell } from '@/components/layout/AppShell'
import type { RoleContextValue } from '@/features/shared/context/createRoleProvider'
import type { NavItem } from '@/routes/config/navConfig'
import type { ComponentType, ReactNode } from 'react'

interface RoleLayoutConfig {
  Provider: ComponentType<{
    sectionTitle: string
    sectionSubtitle?: string
    navItems: NavItem[]
    children: ReactNode
  }>
  sectionTitle: string
  sectionSubtitle?: string
  navItems: NavItem[]
}

export function createRoleLayout({
  Provider,
  sectionTitle,
  sectionSubtitle,
  navItems,
}: RoleLayoutConfig) {
  return function RoleLayout() {
    return (
      <Provider
        sectionTitle={sectionTitle}
        sectionSubtitle={sectionSubtitle}
        navItems={navItems}
      >
        <AppShell
          title={sectionTitle}
          subtitle={sectionSubtitle}
          navItems={navItems}
        />
      </Provider>
    )
  }
}

export type { RoleContextValue }
