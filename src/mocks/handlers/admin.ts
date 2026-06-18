import type { RootState } from '@/app/store'
import type { BackendAuthResponse } from '@/features/auth/utils/authMappers'
import type { BackendCreateUserRequest } from '@/features/admin/utils/personnelMappers'
import { fakeDelay } from '@/mocks/utils'
import { UserRole } from '@/types/roles'

export async function handleAdminCreateUser(
  body: unknown,
  getState: () => unknown,
) {
  await fakeDelay()

  const state = getState() as RootState
  const isAdmin = state.auth.user?.roles.includes(UserRole.ADMIN)

  if (!isAdmin) {
    return { error: { status: 403, data: 'Accès refusé' } }
  }

  const request = body as BackendCreateUserRequest
  const primaryBackendRole = request.roles[0] ?? 'PERSONNEL_ADMIN'

  const response: BackendAuthResponse = {
    token: '',
    email: request.email,
    nom: request.nom,
    prenom: request.prenom,
    role: primaryBackendRole,
    user: {
      id: `mock-${Date.now()}`,
      email: request.email,
      firstName: request.prenom,
      lastName: request.nom,
      roles: request.roles,
    },
  }

  return { data: response }
}
