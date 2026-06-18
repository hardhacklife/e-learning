import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { CoursInput } from '@/features/schedule/api/scheduleApi'
import { FieldLabel, TextInput } from '@/features/formations/components/formFields'
import { getApiErrorMessage } from '@/features/admin/utils/apiError'

interface ModuleFormModalProps {
  open: boolean
  onClose: () => void
  formationId: number
  formationNom: string
  onSubmit: (values: CoursInput) => Promise<void>
  isSubmitting?: boolean
}

export function ModuleFormModal({
  open,
  onClose,
  formationId,
  formationNom,
  onSubmit,
  isSubmitting = false,
}: ModuleFormModalProps) {
  const [code, setCode] = useState('')
  const [nom, setNom] = useState('')
  const [semestre, setSemestre] = useState('S1')
  const [coefficient, setCoefficient] = useState('1')
  const [error, setError] = useState<string | null>(null)

  const reset = () => {
    setCode('')
    setNom('')
    setSemestre('S1')
    setCoefficient('1')
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await onSubmit({
        code: code.trim(),
        nom: nom.trim(),
        semestre: semestre.trim(),
        coefficient: Number(coefficient),
        formationId,
      })
      reset()
      onClose()
    } catch (err) {
      setError(
        getApiErrorMessage(
          err as Parameters<typeof getApiErrorMessage>[0],
          'Impossible de créer le module.',
        ),
      )
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Ajouter un module">
      <p className="mb-3 text-xs text-slate-500">
        Formation : <strong>{formationNom}</strong>
      </p>
      {error && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Code</FieldLabel>
            <TextInput
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="WEB-301"
              required
            />
          </div>
          <div>
            <FieldLabel>Semestre</FieldLabel>
            <TextInput
              value={semestre}
              onChange={(e) => setSemestre(e.target.value)}
              placeholder="S1"
              required
            />
          </div>
        </div>
        <div>
          <FieldLabel>Intitulé du module</FieldLabel>
          <TextInput
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Algorithmique avancée"
            required
          />
        </div>
        <div>
          <FieldLabel>Coefficient</FieldLabel>
          <TextInput
            type="number"
            min={0.5}
            step={0.5}
            value={coefficient}
            onChange={(e) => setCoefficient(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            Créer le module
          </Button>
        </div>
      </form>
    </Modal>
  )
}
