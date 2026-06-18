import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/features/formations/components/ConfirmDialog'
import { CrudActions } from '@/features/formations/components/CrudActions'
import { DepositFormModal } from '@/features/formations/components/DepositFormModal'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  addDeposit,
  deleteDeposit,
  selectFormationsByTrainer,
  updateDeposit,
} from '@/features/formations/slice/formationsSlice'
import {
  formatDepositDate,
  formatDaysLeft,
  getDepositStatus,
} from '@/features/formations/utils/depositUtils'
import { createId } from '@/lib/createId'
import { cn } from '@/lib/utils'
import {
  formatTrainerName,
  getTrainerDeposits,
  type TrainerDepositEntry,
} from '@/mocks/data/studentFormations'

const statusLabels = {
  open: { label: 'Ouvert', className: 'text-emerald-600 bg-emerald-50' },
  closed: { label: 'Fermé', className: 'text-slate-500 bg-slate-100' },
  upcoming: { label: 'Bientôt', className: 'text-amber-600 bg-amber-50' },
} as const

export function TrainerDepositsPage() {
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const trainerName = user
    ? formatTrainerName(user.firstName, user.lastName)
    : ''
  const formations = useAppSelector((state) =>
    selectFormationsByTrainer(state, trainerName),
  )
  const deposits = getTrainerDeposits(formations)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<TrainerDepositEntry | undefined>()
  const [deleting, setDeleting] = useState<TrainerDepositEntry | undefined>()
  const [formationId, setFormationId] = useState(formations[0]?.id ?? '')

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dépôts de projet</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gérez les espaces de dépôt avec date limite
          </p>
        </div>
        <Button
          size="sm"
          disabled={formations.length === 0}
          onClick={() => {
            setEditing(undefined)
            setFormationId(formations[0]?.id ?? '')
            setModalOpen(true)
          }}
        >
          Ouvrir un espace
        </Button>
      </div>

      {deposits.length === 0 ? (
        <div className="rounded-xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">Aucun espace de dépôt.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {deposits.map((entry) => {
            const { formationId: fId, formationTitle, deposit } = entry
            const status = getDepositStatus(deposit)
            const statusInfo = statusLabels[status]
            const daysLeft =
              status === 'open' ? formatDaysLeft(deposit.deadline) : null

            return (
              <li
                key={deposit.id}
                className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {deposit.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {formationTitle}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {deposit.description}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-md px-2 py-0.5 text-xs font-medium',
                      statusInfo.className,
                    )}
                  >
                    {statusInfo.label}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 text-xs text-slate-500">
                  <span>Ouverture : {formatDepositDate(deposit.opensAt)}</span>
                  <span>Limite : {formatDepositDate(deposit.deadline)}</span>
                  {daysLeft && (
                    <span className="font-medium text-emerald-600">
                      {daysLeft}
                    </span>
                  )}
                  <span>{deposit.submittedFiles.length} dépôt(s) reçu(s)</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <Link
                    to={`/trainer/formations/${fId}`}
                    className="text-xs font-medium text-primary-600 hover:text-primary-700"
                  >
                    Voir le module →
                  </Link>
                  <CrudActions
                    onEdit={() => {
                      setEditing(entry)
                      setModalOpen(true)
                    }}
                    onDelete={() => setDeleting(entry)}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <DepositFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(undefined)
        }}
        deposit={editing?.deposit}
        formations={formations.map((f) => ({ id: f.id, title: f.title }))}
        selectedFormationId={editing?.formationId ?? formationId}
        onFormationChange={setFormationId}
        onSubmit={(values) => {
          const fId = editing?.formationId ?? formationId
          const payload = {
            title: values.title,
            description: values.description,
            opensAt: new Date(values.opensAt).toISOString(),
            deadline: new Date(values.deadline).toISOString(),
            maxFiles: values.maxFiles,
            maxFileSizeMb: values.maxFileSizeMb,
            allowedExtensions: values.allowedExtensions
              .split(',')
              .map((e) => e.trim().replace(/^\./, ''))
              .filter(Boolean),
            submittedFiles: editing?.deposit.submittedFiles ?? [],
          }
          if (editing) {
            dispatch(
              updateDeposit({
                formationId: fId,
                depositId: editing.deposit.id,
                data: payload,
              }),
            )
          } else {
            dispatch(
              addDeposit({
                formationId: fId,
                deposit: { id: createId('dep'), ...payload },
              }),
            )
          }
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Supprimer le dépôt"
        message={`Supprimer l'espace « ${deleting?.deposit.title} » ?`}
        onConfirm={() => {
          if (deleting) {
            dispatch(
              deleteDeposit({
                formationId: deleting.formationId,
                depositId: deleting.deposit.id,
              }),
            )
          }
          setDeleting(undefined)
        }}
        onCancel={() => setDeleting(undefined)}
      />
    </div>
  )
}
