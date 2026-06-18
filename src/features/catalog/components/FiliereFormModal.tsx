import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { FiliereCatalog, FiliereCatalogInput } from '@/features/catalog/api/catalogApi'
import { FieldLabel, TextInput } from '@/features/formations/components/formFields'
import { getApiErrorMessage } from '@/features/admin/utils/apiError'

interface FiliereFormModalProps {
  open: boolean
  onClose: () => void
  initial?: FiliereCatalog
  onSubmit: (values: FiliereCatalogInput) => Promise<void>
  isSubmitting?: boolean
}

export function FiliereFormModal({
  open,
  onClose,
  initial,
  onSubmit,
  isSubmitting = false,
}: FiliereFormModalProps) {
  const [values, setValues] = useState<FiliereCatalogInput>({ nom: '', description: '' })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initial) {
      setValues({ nom: initial.nom, description: initial.description ?? '' })
    } else {
      setValues({ nom: '', description: '' })
    }
    setError(null)
  }, [initial, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await onSubmit(values)
      onClose()
    } catch (err) {
      setError(
        getApiErrorMessage(
          err as Parameters<typeof getApiErrorMessage>[0],
          'Impossible d\'enregistrer la filière.',
        ),
      )
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Modifier la filière' : 'Nouvelle filière'}
    >
      {error && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <FieldLabel>Nom</FieldLabel>
          <TextInput
            value={values.nom}
            onChange={(e) => setValues((v) => ({ ...v, nom: e.target.value }))}
            placeholder="Informatique & Réseaux"
            required
          />
        </div>
        <div>
          <FieldLabel>Description</FieldLabel>
          <textarea
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            rows={3}
            value={values.description ?? ''}
            onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  )
}
