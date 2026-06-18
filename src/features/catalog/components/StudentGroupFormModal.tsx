import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type {
  PromotionCatalog,
  StudentGroupCatalog,
  StudentGroupInput,
} from '@/features/catalog/api/catalogApi'
import { slugify } from '@/features/catalog/utils/slugify'
import { FieldLabel, TextInput } from '@/features/formations/components/formFields'
import { getApiErrorMessage } from '@/features/admin/utils/apiError'

interface StudentGroupFormModalProps {
  open: boolean
  onClose: () => void
  promotions: PromotionCatalog[]
  initial?: StudentGroupCatalog
  defaultPromotionId?: number
  onSubmit: (values: StudentGroupInput) => Promise<void>
  isSubmitting?: boolean
}

export function StudentGroupFormModal({
  open,
  onClose,
  promotions,
  initial,
  defaultPromotionId,
  onSubmit,
  isSubmitting = false,
}: StudentGroupFormModalProps) {
  const [values, setValues] = useState<StudentGroupInput>({
    titre: '',
    slug: '',
    description: '',
    promotionId: 0,
  })
  const [slugEdited, setSlugEdited] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const promotionOptions = useMemo(
    () =>
      [...promotions].sort((a, b) =>
        (a.titre ?? a.nom).localeCompare(b.titre ?? b.nom, 'fr'),
      ),
    [promotions],
  )

  useEffect(() => {
    if (initial) {
      setValues({
        titre: initial.titre,
        slug: initial.slug,
        description: initial.description ?? '',
        promotionId: initial.promotionId ?? 0,
      })
      setSlugEdited(true)
    } else {
      setValues({
        titre: '',
        slug: '',
        description: '',
        promotionId: defaultPromotionId ?? promotionOptions[0]?.id ?? 0,
      })
      setSlugEdited(false)
    }
    setError(null)
  }, [initial, open, defaultPromotionId, promotionOptions])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!values.promotionId) {
      setError('Sélectionnez une promotion.')
      return
    }
    try {
      await onSubmit(values)
      onClose()
    } catch (err) {
      setError(
        getApiErrorMessage(
          err as Parameters<typeof getApiErrorMessage>[0],
          'Impossible d\'enregistrer le groupe.',
        ),
      )
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Modifier le groupe' : 'Nouveau groupe d\'étudiants'}
    >
      {error && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <FieldLabel>Promotion</FieldLabel>
          <select
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={values.promotionId || ''}
            onChange={(e) =>
              setValues((v) => ({ ...v, promotionId: Number(e.target.value) }))
            }
            required
          >
            <option value="" disabled>
              Choisir une promotion
            </option>
            {promotionOptions.map((promotion) => (
              <option key={promotion.id} value={promotion.id}>
                {promotion.titre ?? promotion.nom}
                {promotion.formationNom ? ` — ${promotion.formationNom}` : ''}
              </option>
            ))}
          </select>
        </div>
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
            placeholder="Groupe A"
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
            placeholder="groupe-a"
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
