import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { getQuizQuestions } from '@/mocks/data/quizQuestions'
import type { FormationQuiz } from '@/types/formation'

const quizStatusLabels: Record<FormationQuiz['status'], { label: string; className: string }> = {
  available: { label: 'Disponible', className: 'text-emerald-600' },
  completed: { label: 'Terminé', className: 'text-primary-600' },
  locked: { label: 'Verrouillé', className: 'text-slate-400' },
}

const questionTypeLabels = {
  mcq: 'QCM',
  true_false: 'Vrai / Faux',
  open: 'Réponse libre',
}

interface QuizListItemProps {
  quiz: FormationQuiz
  formationId: string
  viewMode?: 'student' | 'trainer'
}

export function QuizListItem({
  quiz,
  formationId,
  viewMode = 'student',
}: QuizListItemProps) {
  const [open, setOpen] = useState(false)
  const status = quizStatusLabels[quiz.status]
  const questions = getQuizQuestions(quiz)
  const isLocked = quiz.status === 'locked'
  const canTake = !isLocked && viewMode === 'student'

  const meta = [
    `${quiz.questionsCount} questions`,
    quiz.duration,
    quiz.score !== undefined ? `Score ${quiz.score}%` : undefined,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <li className="relative pl-3 before:absolute before:-left-4 before:top-[1.25rem] before:h-px before:w-2.5 before:bg-slate-200">
      <div className="flex items-start justify-between gap-3 py-2.5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="min-w-0 flex-1 text-left transition-colors hover:text-primary-700"
        >
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-800">{quiz.title}</p>
            <svg
              className={cn(
                'h-4 w-4 shrink-0 text-slate-400 transition-transform',
                open && 'rotate-180',
              )}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="mt-1 pl-2 text-xs text-slate-500">{meta}</p>
        </button>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className={cn('text-xs font-medium', status.className)}>
            {status.label}
          </span>
          {canTake && (
            <Link
              to={`/student/formations/${formationId}/quiz/${quiz.id}`}
              className={cn(
                'inline-flex h-8 items-center justify-center rounded-lg px-3 text-xs font-medium transition-colors',
                quiz.status === 'completed'
                  ? 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  : 'bg-primary-600 text-white hover:bg-primary-700',
              )}
            >
              {quiz.status === 'completed' ? 'Refaire' : 'Commencer'}
            </Link>
          )}
        </div>
      </div>

      {open && (
        <div className="mb-2 ml-2 border-l border-slate-100 pl-4">
          {isLocked ? (
            <p className="py-2 text-xs text-slate-400">
              Ce quiz est verrouillé. Terminez les modules précédents pour y accéder.
            </p>
          ) : (
            <ul className="space-y-3 py-2">
              {questions.map((question, index) => (
                <li key={question.id} className="text-xs">
                  <div className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-100 text-[10px] font-semibold text-slate-600">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-800">{question.text}</p>
                      <span className="mt-0.5 inline-block text-[10px] text-slate-400">
                        {questionTypeLabels[question.type]}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
              {quiz.questionsCount > questions.length && (
                <p className="pl-7 text-[10px] text-slate-400">
                  + {quiz.questionsCount - questions.length} autres questions
                </p>
              )}
            </ul>
          )}
        </div>
      )}
    </li>
  )
}
