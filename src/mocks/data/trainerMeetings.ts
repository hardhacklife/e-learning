export interface TrainerMeeting {
  id: string
  title: string
  type: 'preparation_cours' | 'preparation_eval' | 'suivi_tutorat'
  formationTitle: string
  date: string
  time: string
  location: string
}

const TYPE_LABELS: Record<TrainerMeeting['type'], string> = {
  preparation_cours: 'Préparation cours',
  preparation_eval: 'Préparation évaluations',
  suivi_tutorat: 'Suivi tutorat',
}

export function getMeetingTypeLabel(type: TrainerMeeting['type']) {
  return TYPE_LABELS[type]
}

export const MOCK_TRAINER_MEETINGS: TrainerMeeting[] = [
  {
    id: 'mtg-1',
    title: 'Préparation évaluation — Dev Web',
    type: 'preparation_eval',
    formationTitle: 'Développement Web Full Stack',
    date: '2026-06-12',
    time: '10:00',
    location: 'Salle pédagogique B2',
  },
  {
    id: 'mtg-2',
    title: 'Réunion pédagogique — L3 Info',
    type: 'preparation_cours',
    formationTitle: 'Développement Web Full Stack',
    date: '2026-06-14',
    time: '14:30',
    location: 'Visioconférence',
  },
  {
    id: 'mtg-3',
    title: 'Suivi tutorat — Groupe A',
    type: 'suivi_tutorat',
    formationTitle: 'Réseaux & Cybersécurité',
    date: '2026-06-17',
    time: '09:00',
    location: 'Salle tutorat, Étage 1',
  },
  {
    id: 'mtg-4',
    title: 'Préparation quiz — TCP/IP',
    type: 'preparation_eval',
    formationTitle: 'Réseaux & Cybersécurité',
    date: '2026-06-19',
    time: '11:00',
    location: 'Bureau formateur',
  },
]
