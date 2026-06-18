import { TutorProvider } from '@/features/tutor/context/TutorProvider'
import { createRoleLayout } from '@/layouts/createRoleLayout'
import { TUTOR_NAV } from '@/routes/config/navConfig'

export const TutorLayout = createRoleLayout({
  Provider: TutorProvider,
  sectionTitle: 'Tutorat',
  sectionSubtitle: 'Suivi des étudiants',
  navItems: TUTOR_NAV,
})
