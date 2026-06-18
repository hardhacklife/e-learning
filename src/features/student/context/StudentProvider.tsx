import { createRoleProvider } from '@/features/shared/context/createRoleProvider'
import { UserRole } from '@/types/roles'

export const {
  RoleProvider: StudentProvider,
  useRoleContext: useStudentContext,
} = createRoleProvider(UserRole.STUDENT)
