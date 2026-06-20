export interface AdminDashboardStats {
  users: number
  students: number
  formations: number
  trainers: number
  personnel: number
  filieres: number
  promotions: number
}

export interface TrainingFormationSummary {
  id: number
  titre: string
  niveau?: string
  typeFormation?: string
  filiereNom?: string
  effectif: number
  formateurNoms?: string[]
}

export interface TrainingDashboardStats {
  formations: number
  schedules: number
  trainers: number
  students: number
  filieres: number
  promotions: number
  formationSummaries: TrainingFormationSummary[]
}

export interface TrainerDashboardStats {
  activeCourses: number
  meetings: number
  students: number
}

export interface StaffDashboardStats {
  incomingMail: number
  outgoingMail: number
  personnel: number
  budgetProjects: number
}

export interface CareerDashboardStats {
  internships: number
  partners: number
  employed: number
  selfEmployed: number
  pendingConventions?: number
  activeInternships?: number
}

export interface TutorDashboardStats {
  sessions: number
  students: number
  upcoming: number
}
