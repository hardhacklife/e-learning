import { createRoleProvider } from '@/features/shared/context/createRoleProvider'
import { UserRole } from '@/types/roles'

export const { RoleProvider: StaffProvider, useRoleContext: useStaffContext } =
  createRoleProvider(UserRole.ADMIN_STAFF)
