import { AdminProvider } from '@/features/admin/context/AdminProvider'
import { createRoleLayout } from '@/layouts/createRoleLayout'
import { ADMIN_NAV } from '@/routes/config/navConfig'

export const AdminLayout = createRoleLayout({
  Provider: AdminProvider,
  sectionTitle: 'Administration',
  sectionSubtitle: 'Gestion globale du système',
  navItems: ADMIN_NAV,
})
