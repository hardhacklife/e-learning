import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { ConfirmDialog } from '@/features/formations/components/ConfirmDialog'
import { FormationFormModal } from '@/features/formations/components/FormationFormModal'
import type { FormationFormValues } from '@/features/formations/components/FormationFormModal'
import { CrudActions } from '@/features/formations/components/CrudActions'
import { ModuleCatalogCard } from '@/features/students/components/ModuleCatalogCard'
import {
  useCreateFormationCatalogMutation,
  useDeleteFormationCatalogMutation,
  useGetFormationParcoursQuery,
  useUpdateFormationCatalogMutation,
  useUpdateFormationParcoursMutation,
} from '@/features/catalog/api/catalogApi'
import { getApiErrorMessage } from '@/features/admin/utils/apiError'
import type { FormateurModuleOption } from '@/features/students/api/studentsApi'
import { useGetMyModulesQuery } from '@/features/students/api/studentsApi'

function moduleToFormValues(
  module: FormateurModuleOption,
  parcours?: { duration?: string; sessionUrl?: string },
): FormationFormValues {
  return {
    title: module.titre,
    description: module.description ?? '',
    imageUrl: module.imageUrl ?? '',
    level: module.niveau ?? 'LICENCE_3',
    type: module.typeFormation ?? 'Présentiel',
    duration: parcours?.duration ?? '4 mois',
    sessionUrl: parcours?.sessionUrl ?? 'https://meet.uchk.sn/session',
  }
}

export function TrainerFormationsPage() {
  const { data: myModules = [], isLoading } = useGetMyModulesQuery()
  const [createFormation, { isLoading: creating }] = useCreateFormationCatalogMutation()
  const [updateFormation, { isLoading: updating }] = useUpdateFormationCatalogMutation()
  const [updateParcours] = useUpdateFormationParcoursMutation()
  const [deleteFormation, { isLoading: deletingFormation }] = useDeleteFormationCatalogMutation()

  const [formOpen, setFormOpen] = useState(false)
  const [editingModule, setEditingModule] = useState<FormateurModuleOption | undefined>()
  const [deletingModule, setDeletingModule] = useState<FormateurModuleOption | undefined>()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { data: editingParcours, isLoading: loadingEditingParcours } =
    useGetFormationParcoursQuery(editingModule?.id ?? 0, {
      skip: !editingModule,
    })

  const handleSubmit = async (values: FormationFormValues) => {
    setSubmitError(null)
    const catalogBody = {
      titre: values.title,
      description: values.description,
      imageUrl: values.imageUrl,
      niveau: values.level,
      typeFormation: values.type,
      duration: values.duration,
      sessionUrl: values.sessionUrl,
    }

    try {
      if (editingModule) {
        await updateFormation({
          id: editingModule.id,
          body: catalogBody,
        }).unwrap()

        await updateParcours({
          id: editingModule.id,
          body: {
            ...(editingParcours ?? { subModules: [], projectDeposits: [] }),
            duration: values.duration,
            sessionUrl: values.sessionUrl,
            trainerName: editingParcours?.trainerName,
            subModules: editingParcours?.subModules ?? [],
            projectDeposits: editingParcours?.projectDeposits ?? [],
          },
        }).unwrap()
      } else {
        await createFormation(catalogBody).unwrap()
      }

      setFormOpen(false)
      setEditingModule(undefined)
    } catch (err) {
      setSubmitError(
        getApiErrorMessage(
          err as Parameters<typeof getApiErrorMessage>[0],
          editingModule
            ? 'Impossible de modifier le module.'
            : 'Impossible de créer le module.',
        ),
      )
    }
  }

  const isSubmitting = creating || updating
  const editingFormValues = editingModule
    ? moduleToFormValues(editingModule, editingParcours)
    : undefined

  return (
    <div>
      <PageHeader
        title="Mes formations"
        description="Modules assignés et formations enregistrées en base de données"
        actions={
          <Button
            size="sm"
            onClick={() => {
              setEditingModule(undefined)
              setSubmitError(null)
              setFormOpen(true)
            }}
          >
            Nouveau module
          </Button>
        }
      />

      {submitError && !formOpen && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{submitError}</p>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : myModules.length === 0 ? (
        <div className="rounded-xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            Aucune formation assignée ni créée. Créez un module ou attendez une assignation.
          </p>
          <Button
            size="sm"
            className="mt-4"
            onClick={() => {
              setEditingModule(undefined)
              setSubmitError(null)
              setFormOpen(true)
            }}
          >
            Nouveau module
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myModules.map((module) => (
            <div key={module.id} className="flex flex-col gap-2">
              <div className="relative">
                <ModuleCatalogCard module={module} basePath="/trainer/formations" />
                <div className="absolute right-3 top-3 flex flex-wrap justify-end gap-1">
                  {module.assignee !== false && <Badge variant="info">Assigné</Badge>}
                  {module.cree && <Badge>Créé par vous</Badge>}
                </div>
              </div>
              {module.cree && (
                <div className="flex justify-end px-1">
                  <CrudActions
                    onEdit={() => {
                      setSubmitError(null)
                      setEditingModule(module)
                      setFormOpen(true)
                    }}
                    onDelete={() => setDeletingModule(module)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <FormationFormModal
        open={formOpen && (!editingModule || !loadingEditingParcours)}
        onClose={() => {
          setFormOpen(false)
          setEditingModule(undefined)
          setSubmitError(null)
        }}
        formation={
          editingFormValues
            ? {
                id: String(editingModule?.id ?? ''),
                title: editingFormValues.title,
                description: editingFormValues.description,
                imageUrl: editingFormValues.imageUrl,
                level: editingFormValues.level,
                type: editingFormValues.type,
                duration: editingFormValues.duration,
                sessionUrl: editingFormValues.sessionUrl,
                managerName: '—',
                trainerName: '—',
                tutorName: '—',
                subModules: [],
                projectDeposits: [],
              }
            : undefined
        }
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />

      {formOpen && editingModule && loadingEditingParcours && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <Spinner size="lg" />
        </div>
      )}

      {submitError && formOpen && (
        <p className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 shadow">
          {submitError}
        </p>
      )}

      <ConfirmDialog
        open={!!deletingModule}
        title="Supprimer le module"
        message={`Supprimer « ${deletingModule?.titre} » ? Cette action est définitive.`}
        onConfirm={async () => {
          if (!deletingModule) return
          setSubmitError(null)
          try {
            await deleteFormation(deletingModule.id).unwrap()
            setDeletingModule(undefined)
          } catch (err) {
            setSubmitError(
              getApiErrorMessage(
                err as Parameters<typeof getApiErrorMessage>[0],
                'Impossible de supprimer le module.',
              ),
            )
            setDeletingModule(undefined)
          }
        }}
        onCancel={() => setDeletingModule(undefined)}
      />

      {deletingFormation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
          <Spinner size="lg" />
        </div>
      )}
    </div>
  )
}
