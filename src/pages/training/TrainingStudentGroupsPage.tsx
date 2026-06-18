import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import {
  useCreateStudentGroupMutation,
  useDeleteStudentGroupMutation,
  useGetFilieresQuery,
  useGetFormationsCatalogQuery,
  useGetPromotionsCatalogQuery,
  useGetStudentGroupsQuery,
  useUpdateStudentGroupMutation,
  type StudentGroupCatalog,
} from '@/features/catalog/api/catalogApi'
import { StudentGroupFormModal } from '@/features/catalog/components/StudentGroupFormModal'
import { ConfirmDialog } from '@/features/formations/components/ConfirmDialog'
import { CrudActions } from '@/features/formations/components/CrudActions'

export function TrainingStudentGroupsPage() {
  const { data: formations = [] } = useGetFormationsCatalogQuery()
  const { data: promotions = [] } = useGetPromotionsCatalogQuery()
  const { data: filieres = [] } = useGetFilieresQuery()

  const [filiereId, setFiliereId] = useState<number | ''>('')
  const [formationId, setFormationId] = useState<number | ''>('')
  const [promotionId, setPromotionId] = useState<number | ''>('')

  const filters = useMemo(() => {
    if (promotionId) return { promotionId }
    if (formationId) return { formationId }
    if (filiereId) return { filiereId }
    return undefined
  }, [promotionId, formationId, filiereId])

  const { data: groups = [], isLoading } = useGetStudentGroupsQuery(filters)
  const [createGroup, { isLoading: creating }] = useCreateStudentGroupMutation()
  const [updateGroup, { isLoading: updating }] = useUpdateStudentGroupMutation()
  const [deleteGroup] = useDeleteStudentGroupMutation()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<StudentGroupCatalog | undefined>()
  const [deleting, setDeleting] = useState<StudentGroupCatalog | undefined>()

  const filiereOptions = useMemo(
    () => [...filieres].sort((a, b) => a.nom.localeCompare(b.nom, 'fr')),
    [filieres],
  )

  const formationOptions = useMemo(() => {
    return formations
      .filter((f) => !filiereId || f.filiereId === filiereId)
      .sort((a, b) => (a.titre ?? a.nom).localeCompare(b.titre ?? b.nom, 'fr'))
  }, [formations, filiereId])

  const promotionOptions = useMemo(() => {
    return promotions
      .filter((p) => !formationId || p.formationId === formationId)
      .sort((a, b) => (a.titre ?? a.nom).localeCompare(b.titre ?? b.nom, 'fr'))
  }, [promotions, formationId])

  const resetDependentFilters = (level: 'filiere' | 'formation') => {
    if (level === 'filiere') {
      setFormationId('')
      setPromotionId('')
    } else {
      setPromotionId('')
    }
  }

  return (
    <div>
      <PageHeader
        title="Groupes d'étudiants"
        description="Sous-groupes par promotion, formation et filière"
        actions={
          <Button
            size="sm"
            disabled={promotions.length === 0}
            onClick={() => {
              setEditing(undefined)
              setModalOpen(true)
            }}
          >
            + Nouveau groupe
          </Button>
        }
      />

      {promotions.length === 0 && (
        <p className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Créez d&apos;abord une promotion avant d&apos;ajouter des groupes.
        </p>
      )}

      <div className="mb-4 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="min-w-[160px] flex-1">
          <label className="mb-1 block text-xs font-medium text-slate-500">Filière</label>
          <select
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={filiereId}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : ''
              setFiliereId(value)
              resetDependentFilters('filiere')
            }}
          >
            <option value="">Toutes les filières</option>
            {filiereOptions.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nom}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[160px] flex-1">
          <label className="mb-1 block text-xs font-medium text-slate-500">Formation</label>
          <select
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={formationId}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : ''
              setFormationId(value)
              resetDependentFilters('formation')
            }}
          >
            <option value="">Toutes les formations</option>
            {formationOptions.map((f) => (
              <option key={f.id} value={f.id}>
                {f.titre ?? f.nom}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[160px] flex-1">
          <label className="mb-1 block text-xs font-medium text-slate-500">Promotion</label>
          <select
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={promotionId}
            onChange={(e) => setPromotionId(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">Toutes les promotions</option>
            {promotionOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.titre ?? p.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : groups.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
          <p className="text-sm text-slate-600">Aucun groupe d&apos;étudiants.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-slate-500">
                <th className="px-4 py-3 font-medium">Titre</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Promotion</th>
                <th className="px-4 py-3 font-medium">Formation</th>
                <th className="px-4 py-3 font-medium">Filière</th>
                <th className="px-4 py-3 font-medium">Effectif</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {groups.map((group) => (
                <tr key={group.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{group.titre}</p>
                    {group.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                        {group.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{group.slug}</td>
                  <td className="px-4 py-3 text-slate-600">{group.promotionTitre ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{group.formationNom ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{group.filiereNom ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{group.effectif ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    <CrudActions
                      onEdit={() => {
                        setEditing(group)
                        setModalOpen(true)
                      }}
                      onDelete={() => setDeleting(group)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <StudentGroupFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(undefined)
        }}
        promotions={promotions}
        initial={editing}
        defaultPromotionId={promotionId || undefined}
        isSubmitting={creating || updating}
        onSubmit={async (values) => {
          if (editing) {
            await updateGroup({ id: editing.id, body: values }).unwrap()
          } else {
            await createGroup(values).unwrap()
          }
          setEditing(undefined)
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Supprimer le groupe"
        message={`Supprimer « ${deleting?.titre} » ?`}
        onConfirm={async () => {
          if (deleting) {
            await deleteGroup(deleting.id).unwrap()
            setDeleting(undefined)
          }
        }}
        onCancel={() => setDeleting(undefined)}
      />
    </div>
  )
}
