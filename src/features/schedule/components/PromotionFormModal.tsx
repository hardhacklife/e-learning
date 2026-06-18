import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { PromotionInput } from '@/features/schedule/api/scheduleApi'
import { FieldLabel, TextInput } from '@/features/formations/components/formFields'
import { getApiErrorMessage } from '@/features/admin/utils/apiError'

interface PromotionFormModalProps {
  open: boolean
  onClose: () => void
  formationId: number
  formationNom: string
  onSubmit: (values: PromotionInput) => Promise<void>
  isSubmitting?: boolean
}

export function PromotionFormModal({
  open,
  onClose,
  formationId,
  formationNom,
  onSubmit,
  isSubmitting = false,
}: PromotionFormModalProps) {
  const [nom, setNom] = useState('')
  const [annee, setAnnee] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await onSubmit({
        nom: nom.trim(),
        anneeAcademique: annee.trim() || nom.trim(),
        formationId,
      })
      setNom('')
      setAnnee('')
      onClose()
    } catch (err) {
      setError(
        getApiErrorMessage(
          err as Parameters<typeof getApiErrorMessage>[0],
          'Impossible de créer la promotion.',
        ),
      )
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Ajouter une promotion (classe)">
      <p className="mb-3 text-xs text-slate-500">
        Formation : <strong>{formationNom}</strong>
      </p>
      {error && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <FieldLabel>Nom de la promotion</FieldLabel>
          <TextInput
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="L3 Marketing — Promo 2025"
            required
          />
        </div>
        <div>
          <FieldLabel>Année académique</FieldLabel>
          <TextInput
            value={annee}
            onChange={(e) => setAnnee(e.target.value)}
            placeholder="2025-2026"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            Créer la promotion
          </Button>
        </div>
      </form>
    </Modal>
  )
}
