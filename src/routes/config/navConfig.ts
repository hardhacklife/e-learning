import type { UserRole } from '@/types/roles'

export interface NavItem {
  label: string
  path: string
  icon?: string
}

export const ADMIN_NAV: NavItem[] = [
  { label: 'Tableau de bord', path: '/admin' },
  { label: 'Personnel', path: '/admin/personnel' },
  { label: 'Système', path: '/admin/system' },
]

export const ADMIN_STAFF_NAV: NavItem[] = [
  { label: 'Tableau de bord', path: '/staff' },
  { label: 'Documents', path: '/staff/documents' },
  { label: 'Ressources humaines', path: '/staff/rh' },
  { label: 'Budget', path: '/staff/budget' },
]

export const TRAINER_NAV: NavItem[] = [
  { label: 'Mes modules', path: '/trainer/formations' },
  { label: 'Étudiants', path: '/trainer/students' },
  { label: 'Emploi du temps', path: '/trainer/emploi-du-temps' },
  { label: 'Quiz', path: '/trainer/quiz' },
  { label: 'Dépôts de projet', path: '/trainer/depots' },
  { label: 'Réunions', path: '/trainer/reunions' },
]

export const TUTOR_NAV: NavItem[] = [
  { label: 'Tableau de bord', path: '/tutor' },
  { label: 'Tutorat', path: '/tutor/sessions' },
  { label: 'Suivi étudiants', path: '/tutor/students' },
]

export const TRAINING_NAV: NavItem[] = [
  { label: 'Tableau de bord', path: '/training' },
  { label: 'Filières', path: '/training/filieres' },
  { label: 'Formations', path: '/training/formations' },
  { label: 'Promotions', path: '/training/promotions' },
  { label: 'Groupes étudiants', path: '/training/student-groups' },
  { label: 'Années académiques', path: '/training/academic-years' },
  { label: 'Emplois du temps', path: '/training/schedule' },
  { label: 'Formateurs', path: '/training/trainers' },
]

export const CAREER_NAV: NavItem[] = [
  { label: 'Tableau de bord', path: '/career' },
  { label: 'Stages', path: '/career/internships' },
  { label: 'Partenaires', path: '/career/partners' },
  { label: 'Statistiques', path: '/career/stats' },
]

export const STUDENT_NAV: NavItem[] = [
  { label: 'Mon dossier', path: '/student/dossier' },
  { label: 'Emploi du temps', path: '/student/emploi-du-temps' },
  { label: 'Mes modules', path: '/student/formations' },
  { label: 'Documents', path: '/student/documents' },
  { label: 'Notifications', path: '/student/notifications' },
]

export const NAV_BY_ROLE: Partial<Record<UserRole, NavItem[]>> = {
  ADMIN: ADMIN_NAV,
  ADMIN_STAFF: ADMIN_STAFF_NAV,
  TEACHER: TRAINER_NAV,
  TUTOR: TUTOR_NAV,
  TRAINING_MANAGER: TRAINING_NAV,
  CAREER_SERVICE: CAREER_NAV,
  STUDENT: STUDENT_NAV,
}
