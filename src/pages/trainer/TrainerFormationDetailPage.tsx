import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/features/formations/components/ConfirmDialog'
import { DepositFormModal } from '@/features/formations/components/DepositFormModal'
import { FormationFormModal } from '@/features/formations/components/FormationFormModal'
import { SubModuleFormModal } from '@/features/formations/components/SubModuleFormModal'
import { FormationStudentsPanel } from '@/features/formations/components/FormationStudentsPanel'
import { TrainerSubModulePanel } from '@/features/formations/components/TrainerSubModulePanel'
import { useCatalogFormation } from '@/features/formations/hooks/useCatalogFormation'
import { useStudentFormation } from '@/features/formations/hooks/useStudentFormation'
import { createEmptySubModuleFields } from '@/features/formations/utils/normalizeFormation'
import { resolveFormationImageUrl } from '@/features/formations/utils/catalogFormationBridge'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useGetMyModulesQuery } from '@/features/students/api/studentsApi'
import {
  addDeposit,
  addSubModule,
  deleteDeposit,
  deleteFormation,
  selectFormationsByTrainer,
  selectFormationById,
  updateDeposit,
  updateFormation,
} from '@/features/formations/slice/formationsSlice'
import { createId } from '@/lib/createId'
import {
  countFormationContent,
  formatTrainerName,
} from '@/mocks/data/studentFormations'
import {
  formatDepositDate,
  formatDaysLeft,
  getDepositStatus,
} from '@/features/formations/utils/depositUtils'
import { cn } from '@/lib/utils'
import type { FormationProjectDeposit } from '@/types/formation'

export function TrainerFormationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const trainerName = user
    ? formatTrainerName(user.firstName, user.lastName)
    : ''

  const { data: myModules = [], isLoading: loadingModules } = useGetMyModulesQuery()

  const localFormation = useAppSelector((state) =>
    id ? selectFormationById(state, id) : undefined,
  )
  const ownFormations = useAppSelector((state) =>
    selectFormationsByTrainer(state, trainerName),
  )
  const isCreated = !!(localFormation && ownFormations.some((f) => f.id === localFormation.id))

  const matchedModule = myModules.find(
    (module) => String(module.id) === id || module.slug === id,
  )
  const isAssigned = matchedModule != null && matchedModule.assignee !== false
  const isCatalogAccessible = isAssigned || matchedModule?.cree === true
  const catalogId = matchedModule?.id ?? (id && !Number.isNaN(Number(id)) ? Number(id) : undefined)
  const useCatalog = isCatalogAccessible && catalogId != null && !isCreated

  const {
    formation: catalogFormation,
    isLoading: loadingCatalog,
    isError: catalogError,
  } = useCatalogFormation(useCatalog ? catalogId : undefined, {
    syncParcoursToApi: !!useCatalog,
  })

  const {
    formation: slugFormation,
    isLoading: loadingSlug,
    isError: slugError,
  } = useStudentFormation(
    useCatalog || isCreated || !id || matchedModule ? undefined : id,
  )

  const formation = isCreated ? localFormation : catalogFormation ?? slugFormation
  const canManageMetadata = isCreated
  const isLoading = loadingModules || (useCatalog && loadingCatalog) || loadingSlug

  const [editModule, setEditModule] = useState(false)
  const [deleteModule, setDeleteModule] = useState(false)
  const [addSubOpen, setAddSubOpen] = useState(false)
  const [depositModal, setDepositModal] = useState<
    FormationProjectDeposit | null | 'new'
  >(null)
  const [depositToDelete, setDepositToDelete] =
    useState<FormationProjectDeposit | null>(null)

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!formation || (!isCreated && !isCatalogAccessible)) {
    return (
      <div className="rounded-lg border border-slate-100 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-slate-500">Formation introuvable ou non accessible.</p>
        <Link
          to="/trainer/formations"
          className="mt-3 inline-block text-xs font-medium text-primary-600 hover:text-primary-700"
        >
          Retour à mes formations
        </Link>
      </div>
    )
  }

  if (catalogError || slugError) {
    return (
      <div className="rounded-lg border border-slate-100 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-slate-500">Impossible de charger cette formation.</p>
        <Link
          to="/trainer/formations"
          className="mt-3 inline-block text-xs font-medium text-primary-600 hover:text-primary-700"
        >
          Retour à mes formations
        </Link>
      </div>
    )
  }

  const stats = countFormationContent(formation)
  const deposits = formation.projectDeposits ?? []

  return (
    <div>
      <Link
        to="/trainer/formations"
        className="mb-3 inline-flex items-center gap-1 text-xs text-slate-500 transition-colors hover:text-slate-800"
      >
        ← Retour
      </Link>

      <div className="relative w-full overflow-hidden rounded-md">
        <img
          src={resolveFormationImageUrl(formation.imageUrl)}
          alt={formation.title}
          className="aspect-[4/1] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="info">{formation.level}</Badge>
              <Badge>{formation.type}</Badge>
            </div>
            <h1 className="mt-1 line-clamp-2 text-base font-bold text-white sm:text-lg">
              {formation.title}
            </h1>
          </div>
          <div className="flex shrink-0 gap-2">
            {canManageMetadata && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/30 bg-white/90 text-slate-800 hover:bg-white"
                  onClick={() => setEditModule(true)}
                >
                  Modifier
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => setDeleteModule(true)}
                >
                  Supprimer
                </Button>
              </>
            )}
            {isAssigned && !canManageMetadata && (
              <Badge className="border-white/30 bg-white/90 text-slate-700">Assigné</Badge>
            )}
            {matchedModule?.cree && !isAssigned && (
              <Badge className="border-white/30 bg-white/90 text-slate-700">Créé</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
        <p className="text-sm leading-relaxed text-slate-600">
          {formation.description}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-5">
          {[
            { label: 'Sous-modules', value: stats.subModules },
            { label: 'Documents', value: stats.documents },
            { label: 'Quiz', value: stats.quizzes },
            { label: 'Ressources', value: stats.resources },
            { label: 'Dépôts', value: stats.deposits },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-lg font-bold text-slate-900">{item.value}</p>
              <p className="text-xs text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {canManageMetadata && (
        <div className="mt-5">
          <FormationStudentsPanel
            formationId={formation.id}
            enrolledStudentIds={formation.enrolledStudentIds ?? []}
          />
        </div>
      )}

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Dépôts de projet
            </h2>
            <p className="text-xs text-slate-500">
              Espaces de dépôt avec date limite
            </p>
          </div>
          <Button size="sm" onClick={() => setDepositModal('new')}>
            + Ouvrir un espace
          </Button>
        </div>
        {deposits.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-400">
            Aucun espace de dépôt
          </p>
        ) : (
          <ul className="space-y-2">
            {deposits.map((deposit) => {
              const status = getDepositStatus(deposit)
              const daysLeft =
                status === 'open' ? formatDaysLeft(deposit.deadline) : null
              return (
                <li
                  key={deposit.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {deposit.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {deposit.description}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Limite : {formatDepositDate(deposit.deadline)}
                      {daysLeft && ` · ${daysLeft}`}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span
                      className={cn(
                        'rounded-md px-2 py-0.5 text-xs font-medium',
                        status === 'open' && 'bg-emerald-50 text-emerald-600',
                        status === 'closed' && 'bg-slate-100 text-slate-500',
                        status === 'upcoming' && 'bg-amber-50 text-amber-600',
                      )}
                    >
                      {status === 'open'
                        ? 'Ouvert'
                        : status === 'closed'
                          ? 'Fermé'
                          : 'Bientôt'}
                    </span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setDepositModal(deposit)}
                        className="text-[10px] font-medium text-slate-600 hover:text-primary-600"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => setDepositToDelete(deposit)}
                        className="text-[10px] font-medium text-rose-600 hover:text-rose-700"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Contenu pédagogique
            </h2>
            <p className="text-xs text-slate-500">
              Sous-modules, documents, quiz et ressources
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setAddSubOpen(true)}>
            + Sous-module
          </Button>
        </div>
        <div className="space-y-3">
          {formation.subModules.map((sub, index) => (
            <TrainerSubModulePanel
              key={sub.id}
              subModule={sub}
              formationId={formation.id}
              enrolledStudentIds={formation.enrolledStudentIds ?? []}
              defaultOpen={index === 0}
            />
          ))}
          {formation.subModules.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-400">
              Ajoutez un sous-module pour commencer
            </p>
          )}
        </div>
      </div>

      <FormationFormModal
        open={editModule && canManageMetadata}
        onClose={() => setEditModule(false)}
        formation={formation}
        onSubmit={async (values) => {
          dispatch(updateFormation({ id: formation.id, data: values }))
        }}
      />

      <SubModuleFormModal
        open={addSubOpen}
        onClose={() => setAddSubOpen(false)}
        onSubmit={(values) =>
          dispatch(
            addSubModule({
              formationId: formation.id,
              subModule: {
                id: createId('sub'),
                ...values,
                order: formation.subModules.length + 1,
                documents: [],
                quizzes: [],
                resources: [],
                ...createEmptySubModuleFields(),
              },
            }),
          )
        }
      />

      <DepositFormModal
        open={depositModal !== null}
        onClose={() => setDepositModal(null)}
        deposit={depositModal && depositModal !== 'new' ? depositModal : undefined}
        formations={[{ id: formation.id, title: formation.title }]}
        selectedFormationId={formation.id}
        onSubmit={(values) => {
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
            submittedFiles: [] as FormationProjectDeposit['submittedFiles'],
          }
          if (depositModal === 'new') {
            dispatch(
              addDeposit({
                formationId: formation.id,
                deposit: { id: createId('dep'), ...payload },
              }),
            )
          } else if (depositModal) {
            dispatch(
              updateDeposit({
                formationId: formation.id,
                depositId: depositModal.id,
                data: payload,
              }),
            )
          }
        }}
      />

      <ConfirmDialog
        open={deleteModule && canManageMetadata}
        title="Supprimer le module"
        message={`Supprimer « ${formation.title} » et tout son contenu ?`}
        onConfirm={() => {
          dispatch(deleteFormation(formation.id))
          navigate('/trainer/formations')
        }}
        onCancel={() => setDeleteModule(false)}
      />

      <ConfirmDialog
        open={!!depositToDelete}
        title="Supprimer le dépôt"
        message={`Supprimer l'espace « ${depositToDelete?.title} » ?`}
        onConfirm={() => {
          if (depositToDelete) {
            dispatch(
              deleteDeposit({
                formationId: formation.id,
                depositId: depositToDelete.id,
              }),
            )
          }
          setDepositToDelete(null)
        }}
        onCancel={() => setDepositToDelete(null)}
      />
    </div>
  )
}
