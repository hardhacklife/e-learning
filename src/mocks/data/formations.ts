export interface MockFormation {
  id: string
  title: string
  startDate: string
  endDate: string
  level: string
  type: string
  funding: string
  maleCount: number
  femaleCount: number
  trainerName: string
}

export const MOCK_FORMATIONS: MockFormation[] = [
  {
    id: 'for-001',
    title: 'Développement Web Full Stack',
    startDate: '2025-01-15',
    endDate: '2025-06-30',
    level: 'Licence',
    type: 'Présentiel',
    funding: 'État',
    maleCount: 28,
    femaleCount: 22,
    trainerName: 'Ibrahima Ndiaye',
  },
  {
    id: 'for-002',
    title: 'Gestion de Projet Agile',
    startDate: '2025-02-01',
    endDate: '2025-05-15',
    level: 'Master',
    type: 'Hybride',
    funding: 'Partenaire',
    maleCount: 15,
    femaleCount: 18,
    trainerName: 'Ousmane Fall',
  },
  {
    id: 'for-003',
    title: 'Introduction à la Data Science',
    startDate: '2024-09-01',
    endDate: '2024-12-20',
    level: 'Licence',
    type: 'En ligne',
    funding: 'État',
    maleCount: 35,
    femaleCount: 30,
    trainerName: 'Ibrahima Ndiaye',
  },
]
