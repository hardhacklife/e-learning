import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  FieldLabel,
  SelectInput,
  TextArea,
  TextInput,
} from '@/features/formations/components/formFields'
import type { MockStudent } from '@/mocks/data/students'
import type {
  StudentAttendanceStatus,
  SubModuleStudentNote,
} from '@/types/formation'

interface StudentNoteFormModalProps {
  open: boolean
  onClose: () => void
  student: MockStudent
  note?: SubModuleStudentNote
  onSubmit: (note: SubModuleStudentNote) => void
}

export function StudentNoteFormModal({
  open,
  onClose,
  student,
  note,
  onSubmit,
}: StudentNoteFormModalProps) {
  const [grade, setGrade] = useState('')
  const [quizScore, setQuizScore] = useState('')
  const [comment, setComment] = useState('')
  const [attendance, setAttendance] =
    useState<StudentAttendanceStatus>('present')

  useEffect(() => {
    if (note) {
      setGrade(note.grade?.toString() ?? '')
      setQuizScore(note.quizScore?.toString() ?? '')
      setComment(note.comment ?? '')
      setAttendance(note.attendance)
    } else {
      setGrade('')
      setQuizScore('')
      setComment('')
      setAttendance('present')
    }
  }, [note, open, student.id])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Note — ${student.firstName} ${student.lastName}`}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit({
            studentId: student.id,
            grade: grade ? Number(grade) : undefined,
            quizScore: quizScore ? Number(quizScore) : undefined,
            comment: comment || undefined,
            attendance,
          })
          onClose()
        }}
        className="space-y-3"
      >
        <p className="text-xs text-slate-500">INE : {student.ine}</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Note /20</FieldLabel>
            <TextInput
              type="number"
              min={0}
              max={20}
              step={0.5}
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="14"
            />
          </div>
          <div>
            <FieldLabel>Score quiz (%)</FieldLabel>
            <TextInput
              type="number"
              min={0}
              max={100}
              value={quizScore}
              onChange={(e) => setQuizScore(e.target.value)}
              placeholder="85"
            />
          </div>
        </div>
        <div>
          <FieldLabel>Présence</FieldLabel>
          <SelectInput
            value={attendance}
            onChange={(e) =>
              setAttendance(e.target.value as StudentAttendanceStatus)
            }
          >
            <option value="present">Présent</option>
            <option value="late">Retard</option>
            <option value="absent">Absent</option>
          </SelectInput>
        </div>
        <div>
          <FieldLabel>Commentaire</FieldLabel>
          <TextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Appréciation, points à améliorer..."
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" size="sm">
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  )
}
