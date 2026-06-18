import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import type { UserRole } from '@/types/roles'

interface RoleGuardProps {
  allowedRoles: UserRole[]
  redirectTo?: string
}

export function RoleGuard({ allowedRoles, redirectTo }: RoleGuardProps) {
  const { hasAnyRole, getHomePath } = useAuth()

  if (!hasAnyRole(allowedRoles)) {
    return <Navigate to={redirectTo ?? getHomePath()} replace />
  }

  return <Outlet />
}
