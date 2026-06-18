import type { PersonnelCategory } from '@/mocks/data/adminPersonnel'
import { UserRole } from '@/types/roles'

export const CATEGORY_API_PATH: Record<PersonnelCategory, string> = {
  administratif: '/administrateurs',
  formation: '/responsables-formation',
  enseignant: '/formateurs',
  tuteur: '/tuteurs',
  etudiant: '/etudiants',
  insertion: '/services-insertion',
}

export interface PersonnelCategoryConfig {
  id: PersonnelCategory
  label: string
  description: string
  apiLabel: string
  roles: UserRole[]
  defaultRole: UserRole
}

export const PERSONNEL_CATEGORIES: PersonnelCategoryConfig[] = [
  {
    id: 'administratif',
    label: 'Administratif',
    description: 'Administrateurs et agents administratifs',
    apiLabel: CATEGORY_API_PATH.administratif,
    roles: [UserRole.ADMIN, UserRole.ADMIN_STAFF],
    defaultRole: UserRole.ADMIN_STAFF,
  },
  {
    id: 'formation',
    label: 'Formation',
    description: 'Responsables de formation et programmes',
    apiLabel: CATEGORY_API_PATH.formation,
    roles: [UserRole.TRAINING_MANAGER],
    defaultRole: UserRole.TRAINING_MANAGER,
  },
  {
    id: 'enseignant',
    label: 'Enseignant',
    description: 'Formateurs et corps enseignant',
    apiLabel: CATEGORY_API_PATH.enseignant,
    roles: [UserRole.TEACHER],
    defaultRole: UserRole.TEACHER,
  },
  {
    id: 'tuteur',
    label: 'Tuteur',
    description: 'Tuteurs et accompagnement pédagogique',
    apiLabel: CATEGORY_API_PATH.tuteur,
    roles: [UserRole.TUTOR],
    defaultRole: UserRole.TUTOR,
  },
  {
    id: 'etudiant',
    label: 'Étudiant',
    description: 'Étudiants inscrits et dossiers académiques',
    apiLabel: CATEGORY_API_PATH.etudiant,
    roles: [UserRole.STUDENT],
    defaultRole: UserRole.STUDENT,
  },
  {
    id: 'insertion',
    label: 'Insertion',
    description: 'Service insertion et partenaires',
    apiLabel: CATEGORY_API_PATH.insertion,
    roles: [UserRole.CAREER_SERVICE],
    defaultRole: UserRole.CAREER_SERVICE,
  },
]

export function getCategoryConfig(id: PersonnelCategory) {
  return PERSONNEL_CATEGORIES.find((c) => c.id === id)!
}

export function roleToCategory(role: UserRole): PersonnelCategory {
  const found = PERSONNEL_CATEGORIES.find((c) => c.roles.includes(role))
  return found?.id ?? 'administratif'
}

export function belongsToCategory(
  role: UserRole,
  category: PersonnelCategory,
): boolean {
  return getCategoryConfig(category).roles.includes(role)
}
