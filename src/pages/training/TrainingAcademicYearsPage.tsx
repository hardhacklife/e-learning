import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import {
  useCreateAcademicYearMutation,
  useDeleteAcademicYearMutation,
  useGetAcademicYearsQuery,
  useUpdateAcademicYearMutation,
  type AcademicYearCatalog,
} from '@/features/catalog/api/catalogApi'
import { AcademicYearFormModal } from '@/features/catalog/components/AcademicYearFormModal'
import { ConfirmDialog } from '@/features/formations/components/ConfirmDialog'
import { CrudActions } from '@/features/formations/components/CrudActions'

export function TrainingAcademicYearsPage() {
  const { data: years = [], isLoading } = useGetAcademicYearsQuery()
  const [createYear, { isLoading: creating }] = useCreateAcademicYearMutation()
  const [updateYear, { isLoading: updating }] = useUpdateAcademicYearMutation()
  const [deleteYear] = useDeleteAcademicYearMutation()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<AcademicYearCatalog | undefined>()
  const [deleting, setDeleting] = useState<AcademicYearCatalog | undefined>()

  return (
    <div>
      <PageHeader
        title="Années académiques"
        description="Référentiel des années pour les promotions"
        actions={
          <Button
            size="sm"
            onClick={() => {
              setEditing(undefined)
              setModalOpen(true)
            }}
          >
            + Nouvelle année
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : years.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
          <p className="text-sm text-slate-600">Aucune année académique.</p>
          <Button size="sm" className="mt-4" onClick={() => setModalOpen(true)}>
            Créer la première année
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {years.map((year) => (
            <div
              key={year.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="min-w-0">
                <h2 className="font-semibold text-slate-900">{year.titre}</h2>
                <p className="mt-0.5 font-mono text-[11px] text-slate-400">/{year.slug}</p>
                {year.description && (
                  <p className="mt-2 text-sm text-slate-600">{year.description}</p>
                )}
              </div>
              <CrudActions
                onEdit={() => {
                  setEditing(year)
                  setModalOpen(true)
                }}
                onDelete={() => setDeleting(year)}
              />
            </div>
          ))}
        </div>
      )}

      <AcademicYearFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(undefined)
        }}
        initial={editing}
        isSubmitting={creating || updating}
        onSubmit={async (values) => {
          if (editing) {
            await updateYear({ id: editing.id, body: values }).unwrap()
          } else {
            await createYear(values).unwrap()
          }
          setEditing(undefined)
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Supprimer l'année académique"
        message={`Supprimer « ${deleting?.titre} » ?`}
        onConfirm={async () => {
          if (deleting) {
            await deleteYear(deleting.id).unwrap()
            setDeleting(undefined)
          }
        }}
        onCancel={() => setDeleting(undefined)}
      />
    </div>
  )
}
