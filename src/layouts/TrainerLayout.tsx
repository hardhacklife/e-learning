import { TrainerProvider } from '@/features/trainer/context/TrainerProvider'
import { TrainerShell } from '@/components/layout/TrainerShell'
import { TRAINER_NAV } from '@/routes/config/navConfig'

export function TrainerLayout() {
  return (
    <TrainerProvider
      sectionTitle="Formateurs"
      sectionSubtitle="Espace enseignant"
      navItems={TRAINER_NAV}
    >
      <TrainerShell navItems={TRAINER_NAV} />
    </TrainerProvider>
  )
}
