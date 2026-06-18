import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  FieldLabel,
  TextArea,
  TextInput,
} from '@/features/formations/components/formFields'
import type { FormationSubModule } from '@/types/formation'

export interface SubModuleFormValues {
  title: string
  description: string
}

interface SubModuleFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: SubModuleFormValues) => void
  subModule?: FormationSubModule
}

export function SubModuleFormModal({
  open,
  onClose,
  onSubmit,
  subModule,
}: SubModuleFormModalProps) {
  const [values, setValues] = useState<SubModuleFormValues>({
    title: '',
    description: '',
  })

  useEffect(() => {
    if (subModule) {
      setValues({ title: subModule.title, description: subModule.description })
    } else {
      setValues({ title: '', description: '' })
    }
  }, [subModule, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(values)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={subModule ? 'Modifier le sous-module' : 'Nouveau sous-module'}
    >
      <form onSubmit={handleSubmit} className="space-y-3">
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
            rows={3}
            required
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" size="sm">
            {subModule ? 'Enregistrer' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
