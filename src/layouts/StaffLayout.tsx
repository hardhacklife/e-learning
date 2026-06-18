import { StaffProvider } from '@/features/staff/context/StaffProvider'
import { createRoleLayout } from '@/layouts/createRoleLayout'
import { ADMIN_STAFF_NAV } from '@/routes/config/navConfig'

export const StaffLayout = createRoleLayout({
  Provider: StaffProvider,
  sectionTitle: 'Administration',
  sectionSubtitle: 'Personnel administratif',
  navItems: ADMIN_STAFF_NAV,
})
