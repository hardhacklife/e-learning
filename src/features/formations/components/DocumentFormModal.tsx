import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  FieldLabel,
  SelectInput,
  TextInput,
} from '@/features/formations/components/formFields'
import type { FormationDocument } from '@/types/formation'

export interface DocumentFormValues {
  title: string
  type: FormationDocument['type']
  size: string
}

interface DocumentFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: DocumentFormValues) => void
  document?: FormationDocument
}

export function DocumentFormModal({
  open,
  onClose,
  onSubmit,
  document,
}: DocumentFormModalProps) {
  const [values, setValues] = useState<DocumentFormValues>({
    title: '',
    type: 'pdf',
    size: '',
  })

  useEffect(() => {
    if (document) {
      setValues({
        title: document.title,
        type: document.type,
        size: document.size ?? '',
      })
    } else {
      setValues({ title: '', type: 'pdf', size: '' })
    }
  }, [document, open])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={document ? 'Modifier le document' : 'Ajouter un document'}
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
                  type: e.target.value as FormationDocument['type'],
                }))
              }
            >
              <option value="pdf">PDF</option>
              <option value="doc">Document</option>
              <option value="slide">Diapositive</option>
            </SelectInput>
          </div>
          <div>
            <FieldLabel>Taille</FieldLabel>
            <TextInput
              value={values.size}
              onChange={(e) => setValues((v) => ({ ...v, size: e.target.value }))}
              placeholder="2,4 Mo"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" size="sm">
            {document ? 'Enregistrer' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
