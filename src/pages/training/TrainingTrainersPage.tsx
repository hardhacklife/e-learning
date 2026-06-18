import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import {
  useAssignFormateurFormationsMutation,
  useGetFormationsCatalogQuery,
  useGetFormateursQuery,
} from '@/features/catalog/api/catalogApi'
import { AssignFormationsModal } from '@/features/catalog/components/AssignFormationsModal'
import type { BackendMembreResponse } from '@/features/admin/utils/personnelMappers'

export function TrainingTrainersPage() {
  const { data: formateurs = [], isLoading } = useGetFormateursQuery()
  const { data: formations = [] } = useGetFormationsCatalogQuery()
  const [assignFormations, { isLoading: assigning }] =
    useAssignFormateurFormationsMutation()

  const [editing, setEditing] = useState<BackendMembreResponse | undefined>()

  return (
    <div>
      <PageHeader
        title="Formateurs"
        description="Enseignants et assignation aux modules"
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : formateurs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
          <p className="text-sm text-slate-600">Aucun enseignant enregistré.</p>
          <p className="mt-2 text-xs text-slate-500">
            Créez des comptes formateurs depuis l&apos;administration (catégorie Enseignant).
          </p>
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
                <th className="px-4 py-3 font-medium">Formations assignées</th>
                <th className="px-4 py-3 font-medium" />
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
                      <span className="text-xs text-slate-400">Aucune</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="outline" onClick={() => setEditing(formateur)}>
                      Assigner
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AssignFormationsModal
        open={!!editing}
        onClose={() => setEditing(undefined)}
        formateur={editing}
        formations={formations}
        isSubmitting={assigning}
        onSubmit={async (formationIds) => {
          if (editing) {
            await assignFormations({
              formateurId: editing.id,
              formationIds,
            }).unwrap()
            setEditing(undefined)
          }
        }}
      />
    </div>
  )
}
