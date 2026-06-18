import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { Button } from '@/components/ui/Button'
import {
  FieldLabel,
  TextArea,
  TextInput,
} from '@/features/formations/components/formFields'
import { updateSubModuleTeacherInfo } from '@/features/formations/slice/formationsSlice'
import {
  DEFAULT_TEACHER_INFO,
} from '@/features/formations/utils/normalizeFormation'
import type { SubModuleStudentNote, SubModuleTeacherInfo } from '@/types/formation'

interface SubModuleInfoTabProps {
  formationId: string
  subModuleId: string
  teacherInfo?: SubModuleTeacherInfo
  studentNotes: SubModuleStudentNote[]
  enrolledCount: number
}

export function SubModuleInfoTab({
  formationId,
  subModuleId,
  teacherInfo,
  studentNotes,
  enrolledCount,
}: SubModuleInfoTabProps) {
  const dispatch = useAppDispatch()
  const info = { ...DEFAULT_TEACHER_INFO, ...teacherInfo }
  const [values, setValues] = useState(info)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setValues({ ...DEFAULT_TEACHER_INFO, ...teacherInfo })
  }, [teacherInfo])

  const presentCount = studentNotes.filter(
    (n) => n.attendance === 'present' || n.attendance === 'late',
  ).length
  const attendanceRate =
    enrolledCount > 0
      ? Math.round((presentCount / enrolledCount) * 100)
      : null

  const gradedNotes = studentNotes.filter((n) => n.grade !== undefined)
  const avgGrade =
    gradedNotes.length > 0
      ? (
          gradedNotes.reduce((s, n) => s + (n.grade ?? 0), 0) / gradedNotes.length
        ).toFixed(1)
      : null

  const handleSave = () => {
    dispatch(
      updateSubModuleTeacherInfo({
        formationId,
        subModuleId,
        data: values,
      }),
    )
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Inscrits', value: enrolledCount },
          { label: 'Présence', value: attendanceRate !== null ? `${attendanceRate}%` : '—' },
          { label: 'Moyenne', value: avgGrade ? `${avgGrade}/20` : '—' },
          {
            label: 'Notes saisies',
            value: `${gradedNotes.length}/${enrolledCount}`,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2 text-center"
          >
            <p className="text-base font-bold text-slate-900">{stat.value}</p>
            <p className="text-[10px] text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-lg border border-slate-100 bg-white p-4">
        <div>
          <FieldLabel>Objectifs pédagogiques</FieldLabel>
          <TextArea
            value={values.objectives}
            onChange={(e) =>
              setValues((v) => ({ ...v, objectives: e.target.value }))
            }
            rows={2}
            placeholder="Ce que les étudiants doivent maîtriser..."
          />
        </div>
        <div>
          <FieldLabel>Points clés / prérequis</FieldLabel>
          <TextArea
            value={values.keyPoints}
            onChange={(e) =>
              setValues((v) => ({ ...v, keyPoints: e.target.value }))
            }
            rows={2}
            placeholder="Concepts importants, prérequis..."
          />
        </div>
        <div>
          <FieldLabel>Prochaine séance</FieldLabel>
          <TextInput
            value={values.nextSession}
            onChange={(e) =>
              setValues((v) => ({ ...v, nextSession: e.target.value }))
            }
            placeholder="Date et contenu prévu"
          />
        </div>
        <div>
          <FieldLabel>Notes internes (formateur)</FieldLabel>
          <TextArea
            value={values.internalNotes}
            onChange={(e) =>
              setValues((v) => ({ ...v, internalNotes: e.target.value }))
            }
            rows={2}
            placeholder="Rappels, matériel à préparer..."
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          {saved && (
            <span className="text-xs text-emerald-600">Enregistré</span>
          )}
          <Button size="sm" onClick={handleSave}>
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  )
}
