import { createRoleProvider } from '@/features/shared/context/createRoleProvider'
import { UserRole } from '@/types/roles'

export const { RoleProvider: TutorProvider, useRoleContext: useTutorContext } =
  createRoleProvider(UserRole.TUTOR)
