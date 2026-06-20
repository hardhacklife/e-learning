import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import {
  useCreateMemberMutation,
  useDeleteMemberMutation,
  useUpdateMemberMutation,
} from '@/features/admin/api/adminApi'
import { PersonnelCategoryFormModal } from '@/features/admin/components/PersonnelCategoryFormModal'
import { getApiErrorMessage } from '@/features/admin/utils/apiError'
import {
  mapMembreToAdminPersonnel,
  type BackendMembreResponse,
} from '@/features/admin/utils/personnelMappers'
import {
  useAssignFormateurFormationsMutation,
  useGetFormationsCatalogQuery,
  useGetFormateursQuery,
} from '@/features/catalog/api/catalogApi'
import { AssignFormationsModal } from '@/features/catalog/components/AssignFormationsModal'
import { ConfirmDialog } from '@/features/formations/components/ConfirmDialog'
import { CrudActions } from '@/features/formations/components/CrudActions'
import type { AdminPersonnel } from '@/mocks/data/adminPersonnel'

function toPersonnel(formateur: BackendMembreResponse): AdminPersonnel {
  return mapMembreToAdminPersonnel(formateur)
}

export function TrainingTrainersPage() {
  const { data: formateurs = [], isLoading } = useGetFormateursQuery()
  const { data: formations = [] } = useGetFormationsCatalogQuery()
  const [createMember, { isLoading: isCreating }] = useCreateMemberMutation()
  const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation()
  const [deleteMember] = useDeleteMemberMutation()
  const [assignFormations, { isLoading: assigning }] =
    useAssignFormateurFormationsMutation()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingPersonnel, setEditingPersonnel] = useState<AdminPersonnel | undefined>()
  const [assigningFormateur, setAssigningFormateur] = useState<
    BackendMembreResponse | undefined
  >()
  const [deleting, setDeleting] = useState<BackendMembreResponse | undefined>()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const openCreate = () => {
    setSubmitError(null)
    setEditingPersonnel(undefined)
    setModalOpen(true)
  }

  const openEdit = (formateur: BackendMembreResponse) => {
    setSubmitError(null)
    setEditingPersonnel(toPersonnel(formateur))
    setModalOpen(true)
  }

  const handleSubmit = async (values: AdminPersonnel, password?: string) => {
    setSubmitError(null)
    try {
      if (editingPersonnel) {
        await updateMember({ values, password }).unwrap()
      } else if (password) {
        await createMember({ values, password }).unwrap()
      }
      setModalOpen(false)
      setEditingPersonnel(undefined)
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(
          error as Parameters<typeof getApiErrorMessage>[0],
          editingPersonnel
            ? 'Impossible de modifier l\'enseignant.'
            : 'Impossible de créer l\'enseignant.',
        ),
      )
      throw new Error('trainer-form-failed')
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setDeleteError(null)
    try {
      await deleteMember({
        id: String(deleting.utilisateurId),
        category: 'enseignant',
      }).unwrap()
      setDeleting(undefined)
    } catch (error) {
      setDeleteError(
        getApiErrorMessage(
          error as Parameters<typeof getApiErrorMessage>[0],
          'Impossible de supprimer cet enseignant.',
        ),
      )
    }
  }

  return (
    <div>
      <PageHeader
        title="Enseignants"
        description="Gestion des formateurs et assignation aux modules"
        actions={
          <Button size="sm" onClick={openCreate}>
            + Enseignant
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : formateurs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
          <p className="text-sm text-slate-600">Aucun enseignant enregistré.</p>
          <Button size="sm" className="mt-4" onClick={openCreate}>
            Ajouter un enseignant
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-slate-500">
                <th className="px-4 py-3 font-medium">Enseignant</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Grade</th>
                <th className="px-4 py-3 font-medium">Spécialité</th>
                <th className="px-4 py-3 font-medium">Modules assignés</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {formateurs.map((formateur) => (
                <tr key={formateur.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {formateur.prenom} {formateur.nom}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formateur.email}</td>
                  <td className="px-4 py-3 text-slate-600">{formateur.grade ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{formateur.specialite ?? '—'}</td>
                  <td className="px-4 py-3">
                    {formateur.formationNoms && formateur.formationNoms.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {formateur.formationNoms.map((name) => (
                          <span
                            key={name}
                            className="rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-700"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Aucun</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setAssigningFormateur(formateur)}
                      >
                        Assigner
                      </Button>
                      <CrudActions
                        onEdit={() => openEdit(formateur)}
                        onDelete={() => {
                          setDeleteError(null)
                          setDeleting(formateur)
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PersonnelCategoryFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingPersonnel(undefined)
          setSubmitError(null)
        }}
        category="enseignant"
        personnel={editingPersonnel}
        isSubmitting={isCreating || isUpdating}
        submitError={submitError}
        onSubmit={handleSubmit}
      />

      <AssignFormationsModal
        open={!!assigningFormateur}
        onClose={() => setAssigningFormateur(undefined)}
        formateur={assigningFormateur}
        formations={formations}
        isSubmitting={assigning}
        onSubmit={async (formationIds) => {
          if (assigningFormateur) {
            await assignFormations({
              formateurId: assigningFormateur.id,
              formationIds,
            }).unwrap()
            setAssigningFormateur(undefined)
          }
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        onCancel={() => {
          setDeleting(undefined)
          setDeleteError(null)
        }}
        onConfirm={handleDelete}
        title="Supprimer l'enseignant"
        message={
          deleteError ??
          `Supprimer ${deleting?.prenom ?? ''} ${deleting?.nom ?? ''} ? Cette action est irréversible.`
        }
        confirmLabel="Supprimer"
      />
    </div>
  )
}
