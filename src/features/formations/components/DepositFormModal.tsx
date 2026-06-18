import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  FieldLabel,
  SelectInput,
  TextArea,
  TextInput,
} from '@/features/formations/components/formFields'
import type { FormationProjectDeposit } from '@/types/formation'

export interface DepositFormValues {
  title: string
  description: string
  opensAt: string
  deadline: string
  maxFiles: number
  maxFileSizeMb: number
  allowedExtensions: string
}

function toLocalDatetime(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

interface DepositFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: DepositFormValues) => void
  deposit?: FormationProjectDeposit
  formations: { id: string; title: string }[]
  selectedFormationId: string
  onFormationChange?: (id: string) => void
}

export function DepositFormModal({
  open,
  onClose,
  onSubmit,
  deposit,
  formations,
  selectedFormationId,
  onFormationChange,
}: DepositFormModalProps) {
  const [values, setValues] = useState<DepositFormValues>({
    title: '',
    description: '',
    opensAt: '',
    deadline: '',
    maxFiles: 3,
    maxFileSizeMb: 20,
    allowedExtensions: 'zip, pdf',
  })

  useEffect(() => {
    if (deposit) {
      setValues({
        title: deposit.title,
        description: deposit.description,
        opensAt: toLocalDatetime(deposit.opensAt),
        deadline: toLocalDatetime(deposit.deadline),
        maxFiles: deposit.maxFiles,
        maxFileSizeMb: deposit.maxFileSizeMb,
        allowedExtensions: deposit.allowedExtensions.join(', '),
      })
    } else {
      setValues({
        title: '',
        description: '',
        opensAt: '',
        deadline: '',
        maxFiles: 3,
        maxFileSizeMb: 20,
        allowedExtensions: 'zip, pdf',
      })
    }
  }, [deposit, open])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={deposit ? 'Modifier le dépôt' : 'Nouvel espace de dépôt'}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(values)
          onClose()
        }}
        className="space-y-3"
      >
        {!deposit && onFormationChange && (
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
          <FieldLabel>Consignes</FieldLabel>
          <TextArea
            value={values.description}
            onChange={(e) =>
              setValues((v) => ({ ...v, description: e.target.value }))
            }
            rows={2}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Date d&apos;ouverture</FieldLabel>
            <TextInput
              type="datetime-local"
              value={values.opensAt}
              onChange={(e) =>
                setValues((v) => ({ ...v, opensAt: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <FieldLabel>Date limite</FieldLabel>
            <TextInput
              type="datetime-local"
              value={values.deadline}
              onChange={(e) =>
                setValues((v) => ({ ...v, deadline: e.target.value }))
              }
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Max fichiers</FieldLabel>
            <TextInput
              type="number"
              min={1}
              value={values.maxFiles}
              onChange={(e) =>
                setValues((v) => ({ ...v, maxFiles: Number(e.target.value) }))
              }
            />
          </div>
          <div>
            <FieldLabel>Taille max (Mo)</FieldLabel>
            <TextInput
              type="number"
              min={1}
              value={values.maxFileSizeMb}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  maxFileSizeMb: Number(e.target.value),
                }))
              }
            />
          </div>
        </div>
        <div>
          <FieldLabel>Extensions autorisées</FieldLabel>
          <TextInput
            value={values.allowedExtensions}
            onChange={(e) =>
              setValues((v) => ({ ...v, allowedExtensions: e.target.value }))
            }
            placeholder="zip, pdf, md"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" size="sm">
            {deposit ? 'Enregistrer' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
