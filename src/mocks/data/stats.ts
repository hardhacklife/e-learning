export const MOCK_ADMIN_STATS = {
  users: 156,
  students: 1240,
  formations: 48,
  trainers: 32,
  personnel: 89,
  filieres: 12,
  promotions: 24,
}

export const MOCK_STUDENT_STATS = {
  formations: 3,
  documents: 12,
  notifications: 5,
}

export const MOCK_TRAINER_STATS = {
  activeCourses: 4,
  meetings: 7,
  students: 86,
}

export const MOCK_STAFF_STATS = {
  incomingMail: 34,
  outgoingMail: 21,
  personnel: 89,
  budgetProjects: 12,
}

export const MOCK_TRAINING_STATS = {
  formations: 48,
  schedules: 24,
  trainers: 32,
  students: 1240,
  filieres: 12,
  promotions: 24,
  formationSummaries: [
    {
      id: 1,
      titre: 'Développement Web Full Stack',
      niveau: 'LICENCE',
      typeFormation: 'Présentiel',
      filiereNom: 'Informatique',
      effectif: 50,
      formateurNoms: ['Ibrahima Ndiaye'],
    },
    {
      id: 2,
      titre: 'Gestion de Projet Agile',
      niveau: 'MASTER',
      typeFormation: 'Hybride',
      filiereNom: 'Management',
      effectif: 33,
      formateurNoms: ['Ousmane Fall', 'Aminata Sow'],
    },
  ],
}

export const MOCK_CAREER_STATS = {
  internships: 156,
  partners: 42,
  employed: 312,
  selfEmployed: 48,
}

export const MOCK_TUTOR_STATS = {
  sessions: 18,
  students: 24,
  upcoming: 3,
}
