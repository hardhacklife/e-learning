import { TrainingProvider } from '@/features/training/context/TrainingProvider'
import { createRoleLayout } from '@/layouts/createRoleLayout'
import { TRAINING_NAV } from '@/routes/config/navConfig'

export const TrainingLayout = createRoleLayout({
  Provider: TrainingProvider,
  sectionTitle: 'Formations',
  sectionSubtitle: 'Gestion académique',
  navItems: TRAINING_NAV,
})
