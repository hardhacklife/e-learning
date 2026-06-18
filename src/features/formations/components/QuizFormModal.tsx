import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  FieldLabel,
  SelectInput,
  TextArea,
  TextInput,
} from '@/features/formations/components/formFields'
import type { FormationQuiz } from '@/types/formation'

export interface QuizFormValues {
  title: string
  description: string
  questionsCount: number
  duration: string
  status: FormationQuiz['status']
}

interface QuizFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: QuizFormValues) => void
  quiz?: FormationQuiz
  formations: { id: string; title: string; subModules: { id: string; title: string }[] }[]
  defaultFormationId?: string
  defaultSubModuleId?: string
  onFormationChange?: (formationId: string) => void
  selectedFormationId: string
  selectedSubModuleId: string
  onSubModuleChange: (subModuleId: string) => void
}

export function QuizFormModal({
  open,
  onClose,
  onSubmit,
  quiz,
  formations,
  selectedFormationId,
  selectedSubModuleId,
  onFormationChange,
  onSubModuleChange,
}: QuizFormModalProps) {
  const [values, setValues] = useState<QuizFormValues>({
    title: '',
    description: '',
    questionsCount: 10,
    duration: '15 min',
    status: 'available',
  })

  const selectedFormation = formations.find((f) => f.id === selectedFormationId)

  useEffect(() => {
    if (quiz) {
      setValues({
        title: quiz.title,
        description: quiz.description ?? '',
        questionsCount: quiz.questionsCount,
        duration: quiz.duration,
        status: quiz.status,
      })
    } else {
      setValues({
        title: '',
        description: '',
        questionsCount: 10,
        duration: '15 min',
        status: 'available',
      })
    }
  }, [quiz, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(values)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={quiz ? 'Modifier le quiz' : 'Nouveau quiz'}
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {!quiz && onFormationChange && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel>Module</FieldLabel>
              <SelectInput
                value={selectedFormationId}
                onChange={(e) => onFormationChange(e.target.value)}
              >
                {formations.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.title}
                  </option>
                ))}
              </SelectInput>
            </div>
            <div>
              <FieldLabel>Sous-module</FieldLabel>
              <SelectInput
                value={selectedSubModuleId}
                onChange={(e) => onSubModuleChange(e.target.value)}
              >
                {selectedFormation?.subModules.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </SelectInput>
            </div>
          </div>
        )}
        <div>
          <FieldLabel>Titre</FieldLabel>
          <TextInput
            value={values.title}
            onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
            required
          />
        </div>
        <div>
          <FieldLabel>Description</FieldLabel>
          <TextArea
            value={values.description}
            onChange={(e) =>
              setValues((v) => ({ ...v, description: e.target.value }))
            }
            rows={2}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Nombre de questions</FieldLabel>
            <TextInput
              type="number"
              min={1}
              max={50}
              value={values.questionsCount}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  questionsCount: Number(e.target.value),
                }))
              }
              required
            />
          </div>
          <div>
            <FieldLabel>Durée</FieldLabel>
            <TextInput
              value={values.duration}
              onChange={(e) => setValues((v) => ({ ...v, duration: e.target.value }))}
              placeholder="15 min"
              required
            />
          </div>
        </div>
        <div>
          <FieldLabel>Statut</FieldLabel>
          <SelectInput
            value={values.status}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                status: e.target.value as FormationQuiz['status'],
              }))
            }
          >
            <option value="available">Disponible</option>
            <option value="locked">Verrouillé</option>
            <option value="completed">Terminé</option>
          </SelectInput>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" size="sm">
            {quiz ? 'Enregistrer' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
