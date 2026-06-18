import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/features/formations/components/ConfirmDialog'
import { CrudActions } from '@/features/formations/components/CrudActions'
import { QuizFormModal } from '@/features/formations/components/QuizFormModal'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  addQuiz,
  deleteQuiz,
  selectFormationsByTrainer,
  updateQuiz,
} from '@/features/formations/slice/formationsSlice'
import { createId } from '@/lib/createId'
import { cn } from '@/lib/utils'
import {
  formatTrainerName,
  getTrainerQuizzes,
  type TrainerQuizEntry,
} from '@/mocks/data/studentFormations'
import type { FormationQuiz } from '@/types/formation'

const statusLabels: Record<
  FormationQuiz['status'],
  { label: string; className: string }
> = {
  available: { label: 'Disponible', className: 'text-emerald-600 bg-emerald-50' },
  completed: { label: 'Terminé', className: 'text-primary-600 bg-primary-50' },
  locked: { label: 'Verrouillé', className: 'text-slate-500 bg-slate-100' },
}

export function TrainerQuizzesPage() {
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const trainerName = user
    ? formatTrainerName(user.firstName, user.lastName)
    : ''
  const formations = useAppSelector((state) =>
    selectFormationsByTrainer(state, trainerName),
  )
  const quizzes = getTrainerQuizzes(formations)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<TrainerQuizEntry | undefined>()
  const [deleting, setDeleting] = useState<TrainerQuizEntry | undefined>()
  const [formationId, setFormationId] = useState(formations[0]?.id ?? '')
  const [subModuleId, setSubModuleId] = useState(
    formations[0]?.subModules[0]?.id ?? '',
  )

  const handleFormationChange = (id: string) => {
    setFormationId(id)
    const f = formations.find((x) => x.id === id)
    setSubModuleId(f?.subModules[0]?.id ?? '')
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Quiz</h1>
          <p className="mt-1 text-sm text-slate-500">
            Créez, modifiez et supprimez les évaluations
          </p>
        </div>
        <Button
          size="sm"
          disabled={formations.length === 0}
          onClick={() => {
            setEditing(undefined)
            setFormationId(formations[0]?.id ?? '')
            setSubModuleId(formations[0]?.subModules[0]?.id ?? '')
            setModalOpen(true)
          }}
        >
          Nouveau quiz
        </Button>
      </div>

      {quizzes.length === 0 ? (
        <div className="rounded-xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">Aucun quiz configuré.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {quizzes.map((entry) => {
            const { formationId: fId, formationTitle, subModuleTitle, quiz } = entry
            const status = statusLabels[quiz.status]
            return (
              <li
                key={`${fId}-${quiz.id}`}
                className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {quiz.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {formationTitle} · {subModuleTitle}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {quiz.questionsCount} questions · {quiz.duration}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-md px-2 py-0.5 text-xs font-medium',
                      status.className,
                    )}
                  >
                    {status.label}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <Link
                    to={`/trainer/formations/${fId}`}
                    className="text-xs font-medium text-primary-600 hover:text-primary-700"
                  >
                    Voir le module →
                  </Link>
                  <CrudActions
                    onEdit={() => {
                      setEditing(entry)
                      setModalOpen(true)
                    }}
                    onDelete={() => setDeleting(entry)}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <QuizFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(undefined)
        }}
        quiz={editing?.quiz}
        formations={formations.map((f) => ({
          id: f.id,
          title: f.title,
          subModules: f.subModules.map((s) => ({ id: s.id, title: s.title })),
        }))}
        selectedFormationId={editing?.formationId ?? formationId}
        selectedSubModuleId={editing?.subModuleId ?? subModuleId}
        onFormationChange={handleFormationChange}
        onSubModuleChange={setSubModuleId}
        onSubmit={(values) => {
          const fId = editing?.formationId ?? formationId
          const sId = editing?.subModuleId ?? subModuleId
          if (editing) {
            dispatch(
              updateQuiz({
                formationId: fId,
                subModuleId: sId,
                quizId: editing.quiz.id,
                data: values,
              }),
            )
          } else {
            dispatch(
              addQuiz({
                formationId: fId,
                subModuleId: sId,
                quiz: { id: createId('quiz'), ...values },
              }),
            )
          }
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Supprimer le quiz"
        message={`Supprimer « ${deleting?.quiz.title} » ?`}
        onConfirm={() => {
          if (deleting) {
            dispatch(
              deleteQuiz({
                formationId: deleting.formationId,
                subModuleId: deleting.subModuleId,
                quizId: deleting.quiz.id,
              }),
            )
          }
          setDeleting(undefined)
        }}
        onCancel={() => setDeleting(undefined)}
      />
    </div>
  )
}
