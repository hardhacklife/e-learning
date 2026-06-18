import { useState } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/features/formations/components/ConfirmDialog'
import {
  enrollStudent,
  unenrollStudent,
} from '@/features/formations/slice/formationsSlice'
import { getInitials } from '@/lib/utils'
import { MOCK_STUDENTS, getStudentsByIds } from '@/mocks/data/students'

interface FormationStudentsPanelProps {
  formationId: string
  enrolledStudentIds: string[]
}

export function FormationStudentsPanel({
  formationId,
  enrolledStudentIds,
}: FormationStudentsPanelProps) {
  const dispatch = useAppDispatch()
  const [showAdd, setShowAdd] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [removingId, setRemovingId] = useState<string | null>(null)

  const enrolled = getStudentsByIds(enrolledStudentIds)
  const available = MOCK_STUDENTS.filter(
    (s) => !enrolledStudentIds.includes(s.id),
  )

  const handleAdd = () => {
    if (!selectedId) return
    dispatch(enrollStudent({ formationId, studentId: selectedId }))
    setSelectedId('')
    setShowAdd(false)
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Liste des étudiants
          </h2>
          <p className="text-xs text-slate-500">
            {enrolled.length} étudiant(s) inscrit(s) à ce module
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowAdd((v) => !v)}
          disabled={available.length === 0 && !showAdd}
        >
          {showAdd ? 'Annuler' : '+ Ajouter'}
        </Button>
      </div>

      {showAdd && available.length > 0 && (
        <div className="mb-3 flex gap-2 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">Sélectionner un étudiant</option>
            {available.map((s) => (
              <option key={s.id} value={s.id}>
                {s.firstName} {s.lastName} — {s.ine}
              </option>
            ))}
          </select>
          <Button size="sm" onClick={handleAdd} disabled={!selectedId}>
            Inscrire
          </Button>
        </div>
      )}

      {enrolled.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-400">
          Aucun étudiant inscrit
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white shadow-sm">
          {enrolled.map((student) => (
            <li
              key={student.id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-700">
                  {getInitials(student.firstName, student.lastName)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {student.ine} · {student.promotion} · {student.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRemovingId(student.id)}
                className="shrink-0 text-xs font-medium text-rose-600 hover:text-rose-700"
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={!!removingId}
        title="Retirer l'étudiant"
        message="Retirer cet étudiant du module ? Ses notes dans les sous-modules seront supprimées."
        confirmLabel="Retirer"
        onConfirm={() => {
          if (removingId) {
            dispatch(unenrollStudent({ formationId, studentId: removingId }))
          }
          setRemovingId(null)
        }}
        onCancel={() => setRemovingId(null)}
      />
    </div>
  )
}
