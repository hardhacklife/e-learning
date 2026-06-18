import { createRoleProvider } from '@/features/shared/context/createRoleProvider'
import { UserRole } from '@/types/roles'

export const {
  RoleProvider: TrainerProvider,
  useRoleContext: useTrainerContext,
} = createRoleProvider(UserRole.TEACHER)
