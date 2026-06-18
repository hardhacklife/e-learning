import type { FormationQuizQuestion } from '@/types/formation'

export function parseQuizDuration(duration: string): number {
  const match = /(\d+)\s*min/i.exec(duration)
  return match ? Number(match[1]) * 60 : 15 * 60
}

export function formatTimer(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function calculateQuizScore(
  questions: FormationQuizQuestion[],
  answers: Record<string, string>,
) {
  let correct = 0
  for (const q of questions) {
    if (answers[q.id] === q.correctAnswer) correct++
  }
  const total = questions.length
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0
  return { correct, total, percent }
}
