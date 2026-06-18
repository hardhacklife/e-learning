import { createRoleProvider } from '@/features/shared/context/createRoleProvider'
import { UserRole } from '@/types/roles'

export const {
  RoleProvider: CareerProvider,
  useRoleContext: useCareerContext,
} = createRoleProvider(UserRole.CAREER_SERVICE)
