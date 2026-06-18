import type { User } from '@/types/auth'
import { UserRole } from '@/types/roles'

export const MOCK_PASSWORD = 'password123'

export interface MockUserAccount extends User {
  password: string
}

export const MOCK_USERS: MockUserAccount[] = [
  {
    id: 'usr-admin-001',
    email: 'admin@uchk.sn',
    password: MOCK_PASSWORD,
    firstName: 'Mamadou',
    lastName: 'Diallo',
    roles: [UserRole.ADMIN],
  },
  {
    id: 'usr-staff-001',
    email: 'staff@uchk.sn',
    password: MOCK_PASSWORD,
    firstName: 'Fatou',
    lastName: 'Sow',
    roles: [UserRole.ADMIN_STAFF],
  },
  {
    id: 'usr-teacher-001',
    email: 'teacher@uchk.sn',
    password: MOCK_PASSWORD,
    firstName: 'Ibrahima',
    lastName: 'Ndiaye',
    roles: [UserRole.TEACHER],
  },
  {
    id: 'usr-tutor-001',
    email: 'tutor@uchk.sn',
    password: MOCK_PASSWORD,
    firstName: 'Aissatou',
    lastName: 'Ba',
    roles: [UserRole.TUTOR],
  },
  {
    id: 'usr-training-001',
    email: 'training@uchk.sn',
    password: MOCK_PASSWORD,
    firstName: 'Ousmane',
    lastName: 'Fall',
    roles: [UserRole.TRAINING_MANAGER],
  },
  {
    id: 'usr-career-001',
    email: 'career@uchk.sn',
    password: MOCK_PASSWORD,
    firstName: 'Mariama',
    lastName: 'Cissé',
    roles: [UserRole.CAREER_SERVICE],
  },
  {
    id: 'usr-student-001',
    email: 'student@uchk.sn',
    password: MOCK_PASSWORD,
    firstName: 'Amadou',
    lastName: 'Sy',
    roles: [UserRole.STUDENT],
  },
]

export function findMockUserByEmail(email: string) {
  return MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export function findMockUserById(id: string) {
  return MOCK_USERS.find((u) => u.id === id)
}

export function toPublicUser(account: MockUserAccount): User {
  return {
    id: account.id,
    email: account.email,
    firstName: account.firstName,
    lastName: account.lastName,
    roles: account.roles,
    avatarUrl: account.avatarUrl,
  }
}
