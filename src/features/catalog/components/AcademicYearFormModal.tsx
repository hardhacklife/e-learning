import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { AcademicYearCatalog, AcademicYearInput } from '@/features/catalog/api/catalogApi'
import { slugify } from '@/features/catalog/utils/slugify'
import { FieldLabel, TextInput } from '@/features/formations/components/formFields'
import { getApiErrorMessage } from '@/features/admin/utils/apiError'

interface AcademicYearFormModalProps {
  open: boolean
  onClose: () => void
  initial?: AcademicYearCatalog
  onSubmit: (values: AcademicYearInput) => Promise<void>
  isSubmitting?: boolean
}

export function AcademicYearFormModal({
  open,
  onClose,
  initial,
  onSubmit,
  isSubmitting = false,
}: AcademicYearFormModalProps) {
  const [values, setValues] = useState<AcademicYearInput>({ titre: '', slug: '', description: '' })
  const [slugEdited, setSlugEdited] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initial) {
      setValues({
        titre: initial.titre,
        slug: initial.slug,
        description: initial.description ?? '',
      })
      setSlugEdited(true)
    } else {
      setValues({ titre: '', slug: '', description: '' })
      setSlugEdited(false)
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
          'Impossible d\'enregistrer l\'année académique.',
        ),
      )
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Modifier l\'année académique' : 'Nouvelle année académique'}
    >
      {error && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <FieldLabel>Titre</FieldLabel>
          <TextInput
            value={values.titre}
            onChange={(e) => {
              const titre = e.target.value
              setValues((v) => ({
                ...v,
                titre,
                slug: !slugEdited && !initial ? slugify(titre) : v.slug,
              }))
            }}
            placeholder="2025-2026"
            required
          />
        </div>
        <div>
          <FieldLabel>Slug</FieldLabel>
          <TextInput
            value={values.slug ?? ''}
            onChange={(e) => {
              setSlugEdited(true)
              setValues((v) => ({ ...v, slug: e.target.value }))
            }}
            placeholder="2025-2026"
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
