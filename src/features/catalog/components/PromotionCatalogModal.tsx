import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type {
  AcademicYearCatalog,
  FormationCatalog,
  PromotionCatalog,
  PromotionCatalogInput,
} from '@/features/catalog/api/catalogApi'
import { slugify } from '@/features/catalog/utils/slugify'
import {
  FieldLabel,
  SelectInput,
  TextInput,
} from '@/features/formations/components/formFields'
import { getApiErrorMessage } from '@/features/admin/utils/apiError'

interface PromotionCatalogModalProps {
  open: boolean
  onClose: () => void
  formations: FormationCatalog[]
  academicYears: AcademicYearCatalog[]
  initial?: PromotionCatalog
  onSubmit: (values: PromotionCatalogInput) => Promise<void>
  isSubmitting?: boolean
}

export function PromotionCatalogModal({
  open,
  onClose,
  formations,
  academicYears,
  initial,
  onSubmit,
  isSubmitting = false,
}: PromotionCatalogModalProps) {
  const [values, setValues] = useState<PromotionCatalogInput>({
    titre: '',
    slug: '',
    description: '',
    formationId: 0,
    anneeAcademiqueId: undefined,
  })
  const [slugEdited, setSlugEdited] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initial) {
      setValues({
        titre: initial.titre ?? initial.nom,
        slug: initial.slug ?? '',
        description: initial.description ?? '',
        formationId: initial.formationId ?? 0,
        anneeAcademiqueId: initial.anneeAcademiqueId,
      })
      setSlugEdited(true)
    } else {
      setValues({
        titre: '',
        slug: '',
        description: '',
        formationId: formations[0]?.id ?? 0,
        anneeAcademiqueId: academicYears[0]?.id,
      })
      setSlugEdited(false)
    }
    setError(null)
  }, [initial, open, formations, academicYears])

  const handleTitreChange = (titre: string) => {
    setValues((v) => ({
      ...v,
      titre,
      slug: !slugEdited && !initial ? slugify(titre) : v.slug,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!values.formationId) {
      setError('Sélectionnez une formation.')
      return
    }
    try {
      await onSubmit(values)
      onClose()
    } catch (err) {
      setError(
        getApiErrorMessage(
          err as Parameters<typeof getApiErrorMessage>[0],
          'Impossible d\'enregistrer la promotion.',
        ),
      )
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Modifier la promotion' : 'Nouvelle promotion'}
    >
      {error && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <FieldLabel>Titre</FieldLabel>
          <TextInput
            value={values.titre}
            onChange={(e) => handleTitreChange(e.target.value)}
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
        <div>
          <FieldLabel>Formation</FieldLabel>
          <SelectInput
            value={values.formationId || ''}
            onChange={(e) =>
              setValues((v) => ({ ...v, formationId: Number(e.target.value) }))
            }
            required
          >
            <option value="" disabled>
              Choisir une formation
            </option>
            {formations.map((f) => (
              <option key={f.id} value={f.id}>
                {f.titre ?? f.nom}
              </option>
            ))}
          </SelectInput>
        </div>
        <div>
          <FieldLabel>Année académique</FieldLabel>
          <SelectInput
            value={values.anneeAcademiqueId ?? ''}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                anneeAcademiqueId: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
          >
            <option value="">Aucune / libre</option>
            {academicYears.map((y) => (
              <option key={y.id} value={y.id}>
                {y.titre}
              </option>
            ))}
          </SelectInput>
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
