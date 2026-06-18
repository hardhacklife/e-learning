import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { SeanceInput } from '@/features/schedule/api/scheduleApi'
import {
  DAY_OPTIONS,
  SEANCE_TYPE_OPTIONS,
  type BackendCours,
  type BackendPromotion,
} from '@/features/schedule/utils/scheduleMappers'
import {
  FieldLabel,
  SelectInput,
  TextInput,
} from '@/features/formations/components/formFields'
import { getApiErrorMessage } from '@/features/admin/utils/apiError'
import { cn } from '@/lib/utils'

interface FormateurOption {
  id: number
  label: string
}

export interface SeanceFormSubmit extends SeanceInput {
  recurrente: boolean
  /** Jours supplémentaires (0=lundi … 6=dimanche) pour dupliquer le même créneau. */
  joursRepetition: number[]
}

interface SeanceFormModalProps {
  open: boolean
  onClose: () => void
  promotion: BackendPromotion
  cours: BackendCours[]
  formateurs: FormateurOption[]
  initial?: SeanceInput & { id?: number }
  onSubmit: (values: SeanceFormSubmit) => Promise<void>
  isSubmitting?: boolean
}

const emptyForm = (promotionId: number): SeanceFormSubmit => ({
  coursId: 0,
  formateurId: 0,
  promotionId,
  jourSemaine: 0,
  heureDebut: '08:00',
  heureFin: '10:00',
  salle: '',
  typeSeance: 'COURS',
  recurrente: true,
  joursRepetition: [],
})

export function SeanceFormModal({
  open,
  onClose,
  promotion,
  cours,
  formateurs,
  initial,
  onSubmit,
  isSubmitting = false,
}: SeanceFormModalProps) {
  const [values, setValues] = useState<SeanceFormSubmit>(() => emptyForm(promotion.id))
  const [error, setError] = useState<string | null>(null)
  const isEditing = !!initial?.id

  useEffect(() => {
    if (initial) {
      setValues({
        ...emptyForm(promotion.id),
        ...initial,
        promotionId: promotion.id,
        recurrente: true,
        joursRepetition: [],
      })
    } else {
      setValues({
        ...emptyForm(promotion.id),
        coursId: cours[0]?.id ?? 0,
        formateurId: formateurs[0]?.id ?? 0,
      })
    }
    setError(null)
  }, [initial, open, promotion.id, cours, formateurs])

  const joursCibles = useMemo(() => {
    const days = new Set<number>([values.jourSemaine, ...values.joursRepetition])
    return [...days].sort((a, b) => a - b)
  }, [values.jourSemaine, values.joursRepetition])

  const toggleJourRepetition = (day: number) => {
    if (day === values.jourSemaine) return
    setValues((v) => {
      const exists = v.joursRepetition.includes(day)
      return {
        ...v,
        joursRepetition: exists
          ? v.joursRepetition.filter((d) => d !== day)
          : [...v.joursRepetition, day],
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!values.coursId) {
      setError('Choisissez un module. Créez-en un via « + Module » si la liste est vide.')
      return
    }
    if (!values.formateurId) {
      setError(
        'Choisissez un enseignant. Créez un compte formateur depuis l\'admin (catégorie Enseignant).',
      )
      return
    }

    try {
      await onSubmit(values)
      onClose()
    } catch (err) {
      setError(
        getApiErrorMessage(
          err as Parameters<typeof getApiErrorMessage>[0],
          'Impossible d\'enregistrer la séance.',
        ),
      )
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Modifier la séance' : 'Ajouter une séance'}
    >
      <p className="mb-3 text-xs text-slate-500">
        Promotion : <strong>{promotion.nom}</strong>
        {promotion.formationNom ? ` · ${promotion.formationNom}` : ''}
      </p>
      {error && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <FieldLabel>Module (cours)</FieldLabel>
          <SelectInput
            value={values.coursId || ''}
            onChange={(e) => setValues((v) => ({ ...v, coursId: Number(e.target.value) }))}
            required
          >
            <option value="" disabled>
              {cours.length === 0
                ? 'Aucun module — créez-en un d\'abord'
                : 'Choisir un module'}
            </option>
            {cours.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.nom}
              </option>
            ))}
          </SelectInput>
        </div>
        <div>
          <FieldLabel>Enseignant</FieldLabel>
          <SelectInput
            value={values.formateurId || ''}
            onChange={(e) =>
              setValues((v) => ({ ...v, formateurId: Number(e.target.value) }))
            }
            required
          >
            <option value="" disabled>
              {formateurs.length === 0
                ? 'Aucun enseignant — créez-en un via l\'admin'
                : 'Choisir un enseignant'}
            </option>
            {formateurs.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </SelectInput>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Jour</FieldLabel>
            <SelectInput
              value={values.jourSemaine}
              onChange={(e) => {
                const jour = Number(e.target.value)
                setValues((v) => ({
                  ...v,
                  jourSemaine: jour,
                  joursRepetition: v.joursRepetition.filter((d) => d !== jour),
                }))
              }}
            >
              {DAY_OPTIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </SelectInput>
          </div>
          <div>
            <FieldLabel>Type</FieldLabel>
            <SelectInput
              value={values.typeSeance}
              onChange={(e) => setValues((v) => ({ ...v, typeSeance: e.target.value }))}
            >
              {SEANCE_TYPE_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </SelectInput>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Début</FieldLabel>
            <TextInput
              type="time"
              value={values.heureDebut}
              onChange={(e) => setValues((v) => ({ ...v, heureDebut: e.target.value }))}
              required
            />
          </div>
          <div>
            <FieldLabel>Fin</FieldLabel>
            <TextInput
              type="time"
              value={values.heureFin}
              onChange={(e) => setValues((v) => ({ ...v, heureFin: e.target.value }))}
              required
            />
          </div>
        </div>
        <div>
          <FieldLabel>Salle</FieldLabel>
          <TextInput
            value={values.salle ?? ''}
            onChange={(e) => setValues((v) => ({ ...v, salle: e.target.value }))}
            placeholder="Ex. Bâtiment A, Salle 204"
          />
        </div>

        {!isEditing && (
          <div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50/80 p-3">
            <label className="flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                className="mt-0.5 rounded border-slate-300"
                checked={values.recurrente}
                onChange={(e) =>
                  setValues((v) => ({ ...v, recurrente: e.target.checked }))
                }
              />
              <span>
                <span className="text-sm font-medium text-slate-800">
                  Récurrent chaque semaine
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  Le créneau se répète toutes les semaines sur l&apos;emploi du temps de la
                  promotion.
                </span>
              </span>
            </label>

            <div>
              <FieldLabel>Répéter aussi sur</FieldLabel>
              <p className="mb-2 text-xs text-slate-500">
                Duplique le même créneau sur d&apos;autres jours (module, enseignant, horaire
                identiques).
              </p>
              <div className="flex flex-wrap gap-1.5">
                {DAY_OPTIONS.map((d) => {
                  const isPrimary = d.value === values.jourSemaine
                  const isSelected = isPrimary || values.joursRepetition.includes(d.value)
                  return (
                    <button
                      key={d.value}
                      type="button"
                      disabled={isPrimary}
                      onClick={() => toggleJourRepetition(d.value)}
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                        isPrimary && 'bg-primary-600 text-white',
                        !isPrimary &&
                          isSelected &&
                          'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300',
                        !isPrimary &&
                          !isSelected &&
                          'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100',
                      )}
                    >
                      {d.label.slice(0, 3)}
                    </button>
                  )
                })}
              </div>
              {joursCibles.length > 1 && (
                <p className="mt-2 text-xs text-emerald-700">
                  {joursCibles.length} séances seront créées ({joursCibles
                    .map((d) => DAY_OPTIONS[d]?.label.slice(0, 3))
                    .join(', ')}
                  ).
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            {isEditing
              ? 'Enregistrer'
              : joursCibles.length > 1
                ? `Créer ${joursCibles.length} séances`
                : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
