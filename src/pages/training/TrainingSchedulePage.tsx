import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { ConfirmDialog } from '@/features/formations/components/ConfirmDialog'
import { CrudActions } from '@/features/formations/components/CrudActions'
import {
  useCreateCoursMutation,
  useCreateFormationMutation,
  useCreatePromotionMutation,
  useCreateSeanceMutation,
  useDeleteSeanceMutation,
  useGetAllSeancesQuery,
  useGetBackendFormationsQuery,
  useGetCoursByFormationQuery,
  useGetEmploiDuTempsByPromotionQuery,
  useGetFormateursQuery,
  useGetPromotionsQuery,
  useUpdateSeanceMutation,
  type SeanceInput,
} from '@/features/schedule/api/scheduleApi'
import { FormationFormModal } from '@/features/schedule/components/FormationFormModal'
import { ModuleFormModal } from '@/features/schedule/components/ModuleFormModal'
import { PromotionFormModal } from '@/features/schedule/components/PromotionFormModal'
import { SeanceFormModal, type SeanceFormSubmit } from '@/features/schedule/components/SeanceFormModal'
import { WeeklySchedule } from '@/features/schedule/components/WeeklySchedule'
import {
  DAY_OPTIONS,
  mapFormateurOption,
  mapSeanceToScheduleEvent,
} from '@/features/schedule/utils/scheduleMappers'
import { MODULE_DRAG_TYPE, moveTimeRange } from '@/features/schedule/utils/scheduleUtils'
import type { BackendSeance } from '@/features/schedule/utils/scheduleMappers'
import type { ScheduleEventMove, ScheduleSlotSelection } from '@/types/schedule'
import { cn } from '@/lib/utils'

export function TrainingSchedulePage() {
  const { data: formations = [], isLoading: formationsLoading } =
    useGetBackendFormationsQuery()
  const { data: formateurs = [] } = useGetFormateursQuery()
  const {
    data: allSeances = [],
    isLoading: allSeancesLoading,
    isError: allSeancesError,
  } = useGetAllSeancesQuery()

  const [formationId, setFormationId] = useState<number | null>(null)
  const [promotionId, setPromotionId] = useState<number | null>(null)

  const selectedFormation = formations.find((f) => f.id === formationId)

  const { data: promotions = [] } = useGetPromotionsQuery(
    formationId ?? undefined,
    { skip: !formationId },
  )
  const selectedPromotion = promotions.find((p) => p.id === promotionId)

  const { data: cours = [], isLoading: coursLoading } = useGetCoursByFormationQuery(
    formationId!,
    { skip: !formationId },
  )
  const { data: emploiDuTemps } = useGetEmploiDuTempsByPromotionQuery(promotionId!, {
    skip: !promotionId,
  })

  const [createFormation, { isLoading: creatingFormation }] = useCreateFormationMutation()
  const [createSeance, { isLoading: creatingSeance }] = useCreateSeanceMutation()
  const [updateSeance, { isLoading: updatingSeance }] = useUpdateSeanceMutation()
  const [deleteSeance] = useDeleteSeanceMutation()
  const [createCours, { isLoading: creatingCours }] = useCreateCoursMutation()
  const [createPromotion, { isLoading: creatingPromotion }] =
    useCreatePromotionMutation()

  const [formationModalOpen, setFormationModalOpen] = useState(false)
  const [seanceModalOpen, setSeanceModalOpen] = useState(false)
  const [moduleModalOpen, setModuleModalOpen] = useState(false)
  const [promotionModalOpen, setPromotionModalOpen] = useState(false)
  const [editingSeance, setEditingSeance] = useState<BackendSeance | undefined>()
  const [deletingSeance, setDeletingSeance] = useState<BackendSeance | undefined>()
  const [seanceDraft, setSeanceDraft] = useState<Partial<SeanceInput> | undefined>()

  const formateurOptions = useMemo(
    () => formateurs.map(mapFormateurOption),
    [formateurs],
  )

  const canPlanSeances =
    !!promotionId && cours.length > 0 && formateurOptions.length > 0

  const scheduleEvents = useMemo(
    () => allSeances.map(mapSeanceToScheduleEvent),
    [allSeances],
  )

  const promotionCount = useMemo(
    () => new Set(allSeances.map((s) => s.promotionId)).size,
    [allSeances],
  )

  const sortedSeances = useMemo(
    () =>
      [...allSeances].sort((a, b) => {
        if (a.jourSemaine !== b.jourSemaine) return a.jourSemaine - b.jourSemaine
        return a.heureDebut.localeCompare(b.heureDebut)
      }),
    [allSeances],
  )

  const seanceToInput = (seance: BackendSeance): SeanceInput & { id: number } => ({
    id: seance.id,
    emploiDuTempsId: seance.emploiDuTempsId,
    coursId: seance.coursId,
    formateurId: seance.formateurId,
    promotionId: seance.promotionId,
    jourSemaine: seance.jourSemaine,
    heureDebut: seance.heureDebut.slice(0, 5),
    heureFin: seance.heureFin.slice(0, 5),
    salle: seance.salle,
    typeSeance: seance.typeSeance,
  })

  const syncContextFromSeance = (seance: BackendSeance) => {
    if (seance.formationId) setFormationId(seance.formationId)
    setPromotionId(seance.promotionId)
  }

  const modalPromotion = useMemo(() => {
    if (selectedPromotion) return selectedPromotion
    if (!editingSeance) return undefined
    return {
      id: editingSeance.promotionId,
      nom: editingSeance.promotionNom,
      formationId: editingSeance.formationId,
      formationNom: editingSeance.formationNom,
    }
  }, [selectedPromotion, editingSeance])

  const openSeanceModal = (draft?: Partial<SeanceInput>) => {
    setEditingSeance(undefined)
    setSeanceDraft(draft)
    setSeanceModalOpen(true)
  }

  const handleSlotSelect = (slot: ScheduleSlotSelection) => {
    if (!canPlanSeances) return
    openSeanceModal({
      jourSemaine: slot.dayOfWeek,
      heureDebut: slot.startTime,
      heureFin: slot.endTime,
      coursId: slot.coursId ?? cours[0]?.id,
      formateurId: formateurOptions[0]?.id,
      promotionId: promotionId!,
    })
  }

  const handleEventClick = (eventId: string) => {
    const seance = allSeances.find((s) => String(s.id) === eventId)
    if (seance) {
      syncContextFromSeance(seance)
      setSeanceDraft(undefined)
      setEditingSeance(seance)
      setSeanceModalOpen(true)
    }
  }

  const handleEventMove = async (move: ScheduleEventMove) => {
    const seance = allSeances.find((s) => String(s.id) === move.eventId)
    if (!seance) return

    const { startTime, endTime } = moveTimeRange(
      seance.heureDebut.slice(0, 5),
      seance.heureFin.slice(0, 5),
      move.startTime,
    )

    try {
      await updateSeance({
        id: seance.id,
        body: {
          ...seanceToInput(seance),
          jourSemaine: move.dayOfWeek,
          heureDebut: startTime,
          heureFin: endTime,
        },
      }).unwrap()
    } catch {
      // conflit horaire — invalidation RTK restaure l'état
    }
  }

  const handleSaveSeance = async (values: SeanceFormSubmit) => {
    const targetPromotionId =
      selectedPromotion?.id ?? editingSeance?.promotionId ?? values.promotionId

    const basePayload: SeanceInput = {
      coursId: values.coursId,
      formateurId: values.formateurId,
      promotionId: targetPromotionId,
      emploiDuTempsId:
        emploiDuTemps?.id ||
        editingSeance?.emploiDuTempsId ||
        values.emploiDuTempsId,
      heureDebut: values.heureDebut,
      heureFin: values.heureFin,
      salle: values.salle,
      typeSeance: values.typeSeance,
      jourSemaine: values.jourSemaine,
    }

    if (editingSeance) {
      await updateSeance({ id: editingSeance.id, body: basePayload }).unwrap()
    } else {
      const jours = [
        ...new Set([values.jourSemaine, ...values.joursRepetition]),
      ].sort((a, b) => a - b)

      for (const jour of jours) {
        await createSeance({ ...basePayload, jourSemaine: jour }).unwrap()
      }
    }
    setEditingSeance(undefined)
    setSeanceDraft(undefined)
  }

  if (formationsLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Emplois du temps"
        description="Vue globale de toutes les séances — les filtres par formation ou promotion arrivent bientôt"
      />

      <div className="mb-4">
        <WeeklySchedule
          events={scheduleEvents}
          editable
          canPlan={canPlanSeances}
          isLoading={allSeancesLoading}
          statsLabel={`${allSeances.length} séance${allSeances.length !== 1 ? 's' : ''} · ${promotionCount} promotion${promotionCount !== 1 ? 's' : ''}`}
          emptyMessage="Aucune séance planifiée. Sélectionnez une promotion pour en ajouter."
          onSlotSelect={handleSlotSelect}
          onEventClick={handleEventClick}
          onEventMove={handleEventMove}
        />
        {allSeancesError && (
          <p className="mt-2 text-sm text-red-600">
            Impossible de charger les séances. Vérifiez que le backend est à jour.
          </p>
        )}
      </div>

      <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Planifier dans (filtres à venir)
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-600">Formation</label>
            <div className="mt-1 flex gap-2">
              <select
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                value={formationId ?? ''}
                onChange={(e) => {
                  const id = e.target.value ? Number(e.target.value) : null
                  setFormationId(id)
                  setPromotionId(null)
                }}
              >
                <option value="">Toutes les formations</option>
                {formations.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nom}
                  </option>
                ))}
              </select>
              <Button size="sm" variant="outline" onClick={() => setFormationModalOpen(true)}>
                +
              </Button>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Promotion (classe)</label>
            <div className="mt-1 flex gap-2">
              <select
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                value={promotionId ?? ''}
                disabled={!formationId}
                onChange={(e) =>
                  setPromotionId(e.target.value ? Number(e.target.value) : null)
                }
              >
                <option value="">
                  {formationId ? 'Choisir une promotion' : 'Choisir une formation d\'abord'}
                </option>
                {promotions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nom}
                  </option>
                ))}
              </select>
              <Button
                size="sm"
                variant="outline"
                disabled={!formationId}
                onClick={() => setPromotionModalOpen(true)}
              >
                +
              </Button>
            </div>
          </div>
        </div>
        {formationId && (
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => setModuleModalOpen(true)}>
              + Module
            </Button>
            {promotionId && (
              <Button
                size="sm"
                onClick={() => openSeanceModal({ promotionId })}
                disabled={!canPlanSeances}
              >
                + Séance
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            Toutes les séances ({allSeances.length})
          </h2>
          <p className="mb-3 text-xs text-slate-500">
            Liste complète — triée par jour et horaire
          </p>
          {allSeancesLoading ? (
            <Spinner />
          ) : sortedSeances.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune séance enregistrée.</p>
          ) : (
            <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {sortedSeances.map((seance) => (
                <li
                  key={seance.id}
                  className="flex items-start justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2.5 transition-colors hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {seance.coursNom}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {DAY_OPTIONS[seance.jourSemaine]?.label}{' '}
                      {seance.heureDebut.slice(0, 5)}–{seance.heureFin.slice(0, 5)}
                      {seance.salle ? ` · ${seance.salle}` : ''}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {seance.formateurNom}
                    </p>
                    <span className="mt-1.5 inline-block rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-medium text-primary-700">
                      {seance.promotionNom}
                    </span>
                  </div>
                  <CrudActions
                    onEdit={() => {
                      syncContextFromSeance(seance)
                      setEditingSeance(seance)
                      setSeanceModalOpen(true)
                    }}
                    onDelete={() => setDeletingSeance(seance)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Modules à glisser</h2>
          <p className="mb-3 text-xs text-slate-500">
            {formationId
              ? `Formation : ${selectedFormation?.nom}`
              : 'Sélectionnez une formation pour voir ses modules'}
          </p>
          {!formationId ? (
            <p className="text-sm text-slate-500">
              Choisissez une formation dans le panneau ci-dessus.
            </p>
          ) : coursLoading ? (
            <Spinner />
          ) : cours.length === 0 ? (
            <p className="text-sm text-amber-700">Aucun module pour cette formation.</p>
          ) : (
            <ul className="max-h-80 space-y-1.5 overflow-y-auto pr-1">
              {cours.map((module) => (
                <li key={module.id}>
                  <div
                    draggable={canPlanSeances}
                    onDragStart={(e) => {
                      e.dataTransfer.setData(MODULE_DRAG_TYPE, String(module.id))
                      e.dataTransfer.setData('text/plain', String(module.id))
                      e.dataTransfer.effectAllowed = 'copy'
                    }}
                    className={cn(
                      'rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 text-xs',
                      canPlanSeances
                        ? 'cursor-grab active:cursor-grabbing hover:border-primary-200 hover:bg-primary-50/60'
                        : 'opacity-50',
                    )}
                  >
                    <span className="font-medium text-slate-800">{module.nom}</span>
                    <span className="mt-0.5 block text-[10px] text-slate-500">
                      {module.code} · {module.semestre}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {formateurOptions.length === 0 && (
            <p className="mt-3 text-xs text-amber-700">
              Aucun enseignant — créez des comptes formateurs via l&apos;admin.
            </p>
          )}
        </div>
      </div>

      {formations.length === 0 && (
        <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-center">
          <Button size="sm" onClick={() => setFormationModalOpen(true)}>
            + Créer une formation
          </Button>
        </div>
      )}

      <FormationFormModal
        open={formationModalOpen}
        onClose={() => setFormationModalOpen(false)}
        isSubmitting={creatingFormation}
        onSubmit={async (values) => {
          const created = await createFormation(values).unwrap()
          setFormationId(created.id)
          setPromotionId(null)
        }}
      />

      {modalPromotion && (
        <SeanceFormModal
          open={seanceModalOpen}
          onClose={() => {
            setSeanceModalOpen(false)
            setEditingSeance(undefined)
            setSeanceDraft(undefined)
          }}
          promotion={modalPromotion}
          cours={cours}
          formateurs={formateurOptions}
          initial={
            editingSeance
              ? seanceToInput(editingSeance)
              : seanceDraft
                ? {
                    ...seanceDraft,
                    promotionId: promotionId ?? seanceDraft.promotionId ?? 0,
                    jourSemaine: seanceDraft.jourSemaine ?? 0,
                    heureDebut: seanceDraft.heureDebut ?? '08:00',
                    heureFin: seanceDraft.heureFin ?? '10:00',
                    typeSeance: seanceDraft.typeSeance ?? 'COURS',
                    coursId: seanceDraft.coursId ?? cours[0]?.id ?? 0,
                    formateurId: seanceDraft.formateurId ?? formateurOptions[0]?.id ?? 0,
                  }
                : undefined
          }
          onSubmit={handleSaveSeance}
          isSubmitting={creatingSeance || updatingSeance}
        />
      )}

      {selectedFormation && formationId && (
        <>
          <ModuleFormModal
            open={moduleModalOpen}
            onClose={() => setModuleModalOpen(false)}
            formationId={formationId}
            formationNom={selectedFormation.nom}
            onSubmit={async (values) => {
              await createCours(values).unwrap()
            }}
            isSubmitting={creatingCours}
          />
          <PromotionFormModal
            open={promotionModalOpen}
            onClose={() => setPromotionModalOpen(false)}
            formationId={formationId}
            formationNom={selectedFormation.nom}
            onSubmit={async (values) => {
              const created = await createPromotion(values).unwrap()
              setPromotionId(created.id)
            }}
            isSubmitting={creatingPromotion}
          />
        </>
      )}

      <ConfirmDialog
        open={!!deletingSeance}
        title="Supprimer la séance"
        message={`Retirer « ${deletingSeance?.coursNom} » de l'emploi du temps ?`}
        onConfirm={async () => {
          if (deletingSeance) {
            await deleteSeance(deletingSeance.id).unwrap()
            setDeletingSeance(undefined)
          }
        }}
        onCancel={() => setDeletingSeance(undefined)}
      />
    </div>
  )
}
