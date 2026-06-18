import { createRoleProvider } from '@/features/shared/context/createRoleProvider'
import { UserRole } from '@/types/roles'

export const {
  RoleProvider: TrainingProvider,
  useRoleContext: useTrainingContext,
} = createRoleProvider(UserRole.TRAINING_MANAGER)
