import type { AuthResponse, User } from '@/types/auth'
import { UserRole } from '@/types/roles'

/** Réponse brute renvoyée par universite-backend */
export interface BackendUserResponse {
  id: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
}

export interface BackendAuthResponse {
  token: string
  email?: string
  nom?: string
  prenom?: string
  role?: string
  user?: BackendUserResponse
}

const BACKEND_ROLE_MAP: Record<string, UserRole> = {
  ADMIN: UserRole.ADMIN,
  FORMATEUR: UserRole.TEACHER,
  PROFESSEUR: UserRole.TEACHER,
  ETUDIANT: UserRole.STUDENT,
  PERSONNEL_ADMIN: UserRole.ADMIN_STAFF,
  TUTEUR: UserRole.TUTOR,
  RESPONSABLE_FORMATION: UserRole.TRAINING_MANAGER,
  SERVICE_INSERTION: UserRole.CAREER_SERVICE,
}

function mapBackendRoles(roles: string[]): UserRole[] {
  return roles
    .map((role) => BACKEND_ROLE_MAP[role])
    .filter((role): role is UserRole => role !== undefined)
}

export function mapBackendUser(user: BackendUserResponse): User {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roles: mapBackendRoles(user.roles),
  }
}

export function mapBackendAuthResponse(response: BackendAuthResponse): AuthResponse {
  const user =
    response.user ??
    ({
      id: '',
      email: response.email ?? '',
      firstName: response.prenom ?? '',
      lastName: response.nom ?? '',
      roles: response.role ? [response.role] : [],
    } satisfies BackendUserResponse)

  return {
    token: response.token,
    user: mapBackendUser(user),
  }
}
