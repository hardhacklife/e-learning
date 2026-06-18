export const UserRole = {
  ADMIN: 'ADMIN',
  ADMIN_STAFF: 'ADMIN_STAFF',
  TEACHER: 'TEACHER',
  TUTOR: 'TUTOR',
  TRAINING_MANAGER: 'TRAINING_MANAGER',
  CAREER_SERVICE: 'CAREER_SERVICE',
  STUDENT: 'STUDENT',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrateur',
  [UserRole.ADMIN_STAFF]: 'Personnel administratif',
  [UserRole.TEACHER]: 'Enseignant',
  [UserRole.TUTOR]: 'Tuteur',
  [UserRole.TRAINING_MANAGER]: 'Responsable de formation',
  [UserRole.CAREER_SERVICE]: 'Service insertion',
  [UserRole.STUDENT]: 'Étudiant',
}

export const ROLE_HOME_PATH: Record<UserRole, string> = {
  [UserRole.ADMIN]: '/admin',
  [UserRole.ADMIN_STAFF]: '/staff',
  [UserRole.TEACHER]: '/trainer/formations',
  [UserRole.TUTOR]: '/tutor',
  [UserRole.TRAINING_MANAGER]: '/training',
  [UserRole.CAREER_SERVICE]: '/career',
  [UserRole.STUDENT]: '/student/dossier',
}

export const ROLE_PREFIXES: Record<UserRole, string> = {
  [UserRole.ADMIN]: '/admin',
  [UserRole.ADMIN_STAFF]: '/staff',
  [UserRole.TEACHER]: '/trainer',
  [UserRole.TUTOR]: '/tutor',
  [UserRole.TRAINING_MANAGER]: '/training',
  [UserRole.CAREER_SERVICE]: '/career',
  [UserRole.STUDENT]: '/student',
}
