import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/features/formations/components/ConfirmDialog'
import { FormationCard } from '@/features/formations/components/FormationCard'
import { FormationFormModal } from '@/features/formations/components/FormationFormModal'
import { CrudActions } from '@/features/formations/components/CrudActions'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  addFormation,
  deleteFormation,
  selectFormationsByTrainer,
  updateFormation,
} from '@/features/formations/slice/formationsSlice'
import { createId } from '@/lib/createId'
import { formatTrainerName } from '@/mocks/data/studentFormations'
import type { StudentFormation } from '@/types/formation'

export function TrainerFormationsPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAuth()
  const trainerName = user
    ? formatTrainerName(user.firstName, user.lastName)
    : ''
  const formations = useAppSelector((state) =>
    selectFormationsByTrainer(state, trainerName),
  )

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<StudentFormation | undefined>()
  const [deleting, setDeleting] = useState<StudentFormation | undefined>()

  const handleSubmit = (values: {
    title: string
    description: string
    imageUrl: string
    level: string
    type: string
    duration: string
    sessionUrl: string
  }) => {
    if (editing) {
      dispatch(updateFormation({ id: editing.id, data: values }))
    } else {
      dispatch(
        addFormation({
          id: createId('mod'),
          ...values,
          managerName: 'Ousmane Fall',
          trainerName,
          tutorName: 'Aissatou Ba',
          subModules: [],
          projectDeposits: [],
          enrolledStudentIds: [],
        }),
      )
    }
    setEditing(undefined)
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Mes formations</h1>
          <p className="mt-1 text-sm text-slate-500">
            Créez et gérez vos modules et leur contenu pédagogique
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditing(undefined)
            setFormOpen(true)
          }}
        >
          Nouveau module
        </Button>
      </div>

      {formations.length === 0 ? (
        <div className="rounded-xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            Aucune formation. Créez votre premier module.
          </p>
          <Button size="sm" className="mt-4" onClick={() => setFormOpen(true)}>
            Nouveau module
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {formations.map((formation) => (
            <div key={formation.id} className="flex flex-col gap-2">
              <FormationCard
                formation={formation}
                basePath="/trainer/formations"
              />
              <div className="flex justify-end px-1">
                <CrudActions
                  onEdit={() => {
                    setEditing(formation)
                    setFormOpen(true)
                  }}
                  onDelete={() => setDeleting(formation)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <FormationFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditing(undefined)
        }}
        formation={editing}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Supprimer le module"
        message={`Supprimer « ${deleting?.title} » et tout son contenu ?`}
        onConfirm={() => {
          if (deleting) {
            dispatch(deleteFormation(deleting.id))
            navigate('/trainer/formations')
          }
          setDeleting(undefined)
        }}
        onCancel={() => setDeleting(undefined)}
      />
    </div>
  )
}
