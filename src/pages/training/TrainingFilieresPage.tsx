import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import {
  useCreateFiliereMutation,
  useDeleteFiliereMutation,
  useGetFilieresQuery,
  useUpdateFiliereMutation,
  type FiliereCatalog,
} from '@/features/catalog/api/catalogApi'
import { FiliereFormModal } from '@/features/catalog/components/FiliereFormModal'
import { ConfirmDialog } from '@/features/formations/components/ConfirmDialog'
import { CrudActions } from '@/features/formations/components/CrudActions'

export function TrainingFilieresPage() {
  const { data: filieres = [], isLoading } = useGetFilieresQuery()
  const [createFiliere, { isLoading: creating }] = useCreateFiliereMutation()
  const [updateFiliere, { isLoading: updating }] = useUpdateFiliereMutation()
  const [deleteFiliere] = useDeleteFiliereMutation()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<FiliereCatalog | undefined>()
  const [deleting, setDeleting] = useState<FiliereCatalog | undefined>()

  return (
    <div>
      <PageHeader
        title="Filières"
        description="Parcours regroupant des modules (formations) et des étudiants"
        actions={
          <Button
            size="sm"
            onClick={() => {
              setEditing(undefined)
              setModalOpen(true)
            }}
          >
            + Nouvelle filière
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : filieres.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
          <p className="text-sm text-slate-600">Aucune filière enregistrée.</p>
          <Button size="sm" className="mt-4" onClick={() => setModalOpen(true)}>
            Créer la première filière
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-slate-500">
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Modules</th>
                <th className="px-4 py-3 font-medium">Étudiants</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filieres.map((filiere) => (
                <tr key={filiere.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <Link
                      to={`/training/filieres/${filiere.id}`}
                      className="font-medium text-primary-600 hover:underline"
                    >
                      {filiere.nom}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {filiere.description ? (
                      <span className="line-clamp-2">{filiere.description}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{filiere.moduleCount ?? 0}</td>
                  <td className="px-4 py-3 text-slate-600">{filiere.etudiantCount ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    <CrudActions
                      onEdit={() => {
                        setEditing(filiere)
                        setModalOpen(true)
                      }}
                      onDelete={() => setDeleting(filiere)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <FiliereFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(undefined)
        }}
        initial={editing}
        isSubmitting={creating || updating}
        onSubmit={async (values) => {
          if (editing) {
            await updateFiliere({ id: editing.id, body: values }).unwrap()
          } else {
            await createFiliere(values).unwrap()
          }
          setEditing(undefined)
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Supprimer la filière"
        message={`Supprimer « ${deleting?.nom} » ?`}
        onConfirm={async () => {
          if (deleting) {
            await deleteFiliere(deleting.id).unwrap()
            setDeleting(undefined)
          }
        }}
        onCancel={() => setDeleting(undefined)}
      />
    </div>
  )
}
