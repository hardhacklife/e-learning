import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { FormationCatalog } from '@/features/catalog/api/catalogApi'
import type { BackendMembreResponse } from '@/features/admin/utils/personnelMappers'
import { getApiErrorMessage } from '@/features/admin/utils/apiError'

interface AssignFormationsModalProps {
  open: boolean
  onClose: () => void
  formateur?: BackendMembreResponse
  formations: FormationCatalog[]
  onSubmit: (formationIds: number[]) => Promise<void>
  isSubmitting?: boolean
}

export function AssignFormationsModal({
  open,
  onClose,
  formateur,
  formations,
  onSubmit,
  isSubmitting = false,
}: AssignFormationsModalProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setSelectedIds(formateur?.formationIds ?? [])
    setError(null)
  }, [formateur, open])

  const toggleFormation = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await onSubmit(selectedIds)
      onClose()
    } catch (err) {
      setError(
        getApiErrorMessage(
          err as Parameters<typeof getApiErrorMessage>[0],
          'Impossible d\'assigner les formations.',
        ),
      )
    }
  }

  const formateurName = formateur
    ? `${formateur.prenom} ${formateur.nom}`.trim()
    : ''

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Formations — ${formateurName}`}
    >
      {error && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        {formations.length === 0 ? (
          <p className="text-sm text-slate-600">
            Aucune formation disponible. Créez d&apos;abord des formations.
          </p>
        ) : (
          <ul className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3">
            {formations.map((formation) => (
              <li key={formation.id}>
                <label className="flex cursor-pointer items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    checked={selectedIds.includes(formation.id)}
                    onChange={() => toggleFormation(formation.id)}
                  />
                  <span>
                    <span className="font-medium text-slate-900">
                      {formation.titre ?? formation.nom}
                    </span>
                    {formation.filiereNom && (
                      <span className="ml-1 text-slate-500">({formation.filiereNom})</span>
                    )}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button
            type="submit"
            size="sm"
            isLoading={isSubmitting}
            disabled={formations.length === 0}
          >
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  )
}
