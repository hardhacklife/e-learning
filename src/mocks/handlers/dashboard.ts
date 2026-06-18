import {
  MOCK_ADMIN_STATS,
  MOCK_CAREER_STATS,
  MOCK_STAFF_STATS,
  MOCK_STUDENT_STATS,
  MOCK_TRAINER_STATS,
  MOCK_TRAINING_STATS,
  MOCK_TUTOR_STATS,
} from '@/mocks/data/stats'
import { fakeDelay } from '@/mocks/utils'

export async function handleDashboardStats(path: string) {
  await fakeDelay(250)

  const statsMap: Record<string, unknown> = {
    'dashboard/admin': MOCK_ADMIN_STATS,
    'dashboard/student': MOCK_STUDENT_STATS,
    'dashboard/trainer': MOCK_TRAINER_STATS,
    'dashboard/staff': MOCK_STAFF_STATS,
    'dashboard/training': MOCK_TRAINING_STATS,
    'dashboard/career': MOCK_CAREER_STATS,
    'dashboard/tutor': MOCK_TUTOR_STATS,
  }

  const data = statsMap[path]
  if (!data) {
    return { error: { status: 404, data: 'Statistiques introuvables' } }
  }

  return { data }
}
