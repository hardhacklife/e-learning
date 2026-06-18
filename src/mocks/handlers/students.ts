import { MOCK_STUDENTS } from '@/mocks/data/students'
import { fakeDelay } from '@/mocks/utils'

export async function handleStudentsList() {
  await fakeDelay()
  return { data: MOCK_STUDENTS }
}

export async function handleStudentById(id: string) {
  await fakeDelay()
  const student = MOCK_STUDENTS.find((s) => s.id === id)
  if (!student) {
    return { error: { status: 404, data: 'Étudiant introuvable' } }
  }
  return { data: student }
}
