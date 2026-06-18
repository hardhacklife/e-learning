import { createRoleProvider } from '@/features/shared/context/createRoleProvider'
import { UserRole } from '@/types/roles'

export const { RoleProvider: AdminProvider, useRoleContext: useAdminContext } =
  createRoleProvider(UserRole.ADMIN)
