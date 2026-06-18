import { useState } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { CrudActions } from '@/features/formations/components/CrudActions'
import { StudentNoteFormModal } from '@/features/formations/components/StudentNoteFormModal'
import {
  deleteSubModuleStudentNote,
  upsertSubModuleStudentNote,
} from '@/features/formations/slice/formationsSlice'
import { cn } from '@/lib/utils'
import { getStudentsByIds } from '@/mocks/data/students'
import type { MockStudent } from '@/mocks/data/students'
import type { SubModuleStudentNote } from '@/types/formation'

const attendanceLabels = {
  present: { label: 'Présent', className: 'text-emerald-600' },
  late: { label: 'Retard', className: 'text-amber-600' },
  absent: { label: 'Absent', className: 'text-rose-600' },
} as const

interface SubModuleNotesTabProps {
  formationId: string
  subModuleId: string
  enrolledStudentIds: string[]
  studentNotes: SubModuleStudentNote[]
}

export function SubModuleNotesTab({
  formationId,
  subModuleId,
  enrolledStudentIds,
  studentNotes,
}: SubModuleNotesTabProps) {
  const dispatch = useAppDispatch()
  const students = getStudentsByIds(enrolledStudentIds)
  const [editing, setEditing] = useState<{
    student: MockStudent
    note?: SubModuleStudentNote
  } | null>(null)

  if (students.length === 0) {
    return (
      <p className="rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
        Aucun étudiant inscrit au module. Ajoutez des étudiants dans la liste
        ci-dessus.
      </p>
    )
  }

  const averageGrade =
    studentNotes.filter((n) => n.grade !== undefined).length > 0
      ? (
          studentNotes.reduce((sum, n) => sum + (n.grade ?? 0), 0) /
          studentNotes.filter((n) => n.grade !== undefined).length
        ).toFixed(1)
      : null

  return (
    <>
      {averageGrade && (
        <p className="mb-3 text-xs text-slate-500">
          Moyenne du sous-module :{' '}
          <span className="font-semibold text-slate-800">{averageGrade}/20</span>
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-100">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              <th className="px-3 py-2 font-medium">Étudiant</th>
              <th className="px-3 py-2 font-medium">Note</th>
              <th className="px-3 py-2 font-medium">Quiz</th>
              <th className="px-3 py-2 font-medium">Présence</th>
              <th className="px-3 py-2 font-medium">Commentaire</th>
              <th className="px-3 py-2 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => {
              const note = studentNotes.find((n) => n.studentId === student.id)
              const attendance = note
                ? attendanceLabels[note.attendance]
                : null

              return (
                <tr key={student.id} className="bg-white">
                  <td className="px-3 py-2.5">
                    <p className="font-medium text-slate-800">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-xs text-slate-400">{student.ine}</p>
                  </td>
                  <td className="px-3 py-2.5 text-slate-700">
                    {note?.grade !== undefined ? `${note.grade}/20` : '—'}
                  </td>
                  <td className="px-3 py-2.5 text-slate-700">
                    {note?.quizScore !== undefined ? `${note.quizScore}%` : '—'}
                  </td>
                  <td className="px-3 py-2.5">
                    {attendance ? (
                      <span
                        className={cn('text-xs font-medium', attendance.className)}
                      >
                        {attendance.label}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="max-w-[140px] truncate px-3 py-2.5 text-xs text-slate-500">
                    {note?.comment ?? '—'}
                  </td>
                  <td className="px-3 py-2.5">
                    {note ? (
                      <CrudActions
                        onEdit={() => setEditing({ student, note })}
                        onDelete={() =>
                          dispatch(
                            deleteSubModuleStudentNote({
                              formationId,
                              subModuleId,
                              studentId: student.id,
                            }),
                          )
                        }
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditing({ student })}
                        className="text-xs font-medium text-primary-600 hover:text-primary-700"
                      >
                        Saisir
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {editing && (
        <StudentNoteFormModal
          open
          onClose={() => setEditing(null)}
          student={editing.student}
          note={editing.note}
          onSubmit={(note) =>
            dispatch(
              upsertSubModuleStudentNote({
                formationId,
                subModuleId,
                note,
              }),
            )
          }
        />
      )}
    </>
  )
}
