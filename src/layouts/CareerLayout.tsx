import { CareerProvider } from '@/features/career/context/CareerProvider'
import { createRoleLayout } from '@/layouts/createRoleLayout'
import { CAREER_NAV } from '@/routes/config/navConfig'

export const CareerLayout = createRoleLayout({
  Provider: CareerProvider,
  sectionTitle: 'Insertion',
  sectionSubtitle: 'Service insertion professionnelle',
  navItems: CAREER_NAV,
})
