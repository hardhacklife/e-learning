import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  FieldLabel,
  SelectInput,
  TextInput,
} from '@/features/formations/components/formFields'
import type { FormationResource } from '@/types/formation'

export interface ResourceFormValues {
  title: string
  type: FormationResource['type']
  duration: string
}

interface ResourceFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: ResourceFormValues) => void
  resource?: FormationResource
}

export function ResourceFormModal({
  open,
  onClose,
  onSubmit,
  resource,
}: ResourceFormModalProps) {
  const [values, setValues] = useState<ResourceFormValues>({
    title: '',
    type: 'link',
    duration: '',
  })

  useEffect(() => {
    if (resource) {
      setValues({
        title: resource.title,
        type: resource.type,
        duration: resource.duration ?? '',
      })
    } else {
      setValues({ title: '', type: 'link', duration: '' })
    }
  }, [resource, open])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={resource ? 'Modifier la ressource' : 'Ajouter une ressource'}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(values)
          onClose()
        }}
        className="space-y-3"
      >
        <div>
          <FieldLabel>Titre</FieldLabel>
          <TextInput
            value={values.title}
            onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Type</FieldLabel>
            <SelectInput
              value={values.type}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  type: e.target.value as FormationResource['type'],
                }))
              }
            >
              <option value="video">Vidéo</option>
              <option value="link">Lien</option>
              <option value="article">Article</option>
              <option value="exercise">Exercice</option>
            </SelectInput>
          </div>
          <div>
            <FieldLabel>Durée</FieldLabel>
            <TextInput
              value={values.duration}
              onChange={(e) =>
                setValues((v) => ({ ...v, duration: e.target.value }))
              }
              placeholder="45 min"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" size="sm">
            {resource ? 'Enregistrer' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
