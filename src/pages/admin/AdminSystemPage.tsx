import { useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/shared/table/DataTable'
import { TableFilters } from '@/components/shared/table/TableFilters'
import { useTableFilters } from '@/components/shared/table/useTableFilters'
import { SystemSettingFormModal } from '@/features/admin/components/SystemSettingFormModal'
import {
  addSystemSetting,
  deleteSystemSetting,
  selectSystemSettings,
  updateSystemSetting,
} from '@/features/admin/slice/adminSlice'
import { ConfirmDialog } from '@/features/formations/components/ConfirmDialog'
import { CrudActions } from '@/features/formations/components/CrudActions'
import { createId } from '@/lib/createId'
import {
  buildSystemFilterConfig,
  filterSystemSettings,
  SYSTEM_STATUS_LABELS,
  type SystemSetting,
  type SystemSettingStatus,
} from '@/mocks/data/adminSystemSettings'

const statusVariant: Record<
  SystemSettingStatus,
  'success' | 'warning' | 'default'
> = {
  enabled: 'success',
  warning: 'warning',
  disabled: 'default',
}

export function AdminSystemPage() {
  const dispatch = useAppDispatch()
  const settings = useAppSelector(selectSystemSettings)
  const filterConfig = useMemo(
    () => buildSystemFilterConfig(settings),
    [settings],
  )
  const categories = useMemo(
    () => Array.from(new Set(settings.map((s) => s.category))).sort(),
    [settings],
  )

  const { filters, setFilter, resetFilters, filtered, hasActiveFilters } =
    useTableFilters(settings, filterConfig, filterSystemSettings)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<SystemSetting | undefined>()
  const [deleting, setDeleting] = useState<SystemSetting | undefined>()

  const columns = useMemo(
    () => [
      {
        key: 'category',
        header: 'Catégorie',
        render: (row: SystemSetting) => (
          <span className="text-xs font-medium text-slate-600">
            {row.category}
          </span>
        ),
      },
      {
        key: 'name',
        header: 'Paramètre',
        render: (row: SystemSetting) => (
          <span className="text-sm text-slate-800">{row.name}</span>
        ),
      },
      {
        key: 'value',
        header: 'Valeur',
        render: (row: SystemSetting) => (
          <span className="text-xs text-slate-500">{row.value}</span>
        ),
      },
      {
        key: 'status',
        header: 'État',
        render: (row: SystemSetting) => (
          <Badge variant={statusVariant[row.status]}>
            {SYSTEM_STATUS_LABELS[row.status]}
          </Badge>
        ),
      },
      {
        key: 'updated',
        header: 'Mise à jour',
        className: 'text-xs text-slate-400',
        render: (row: SystemSetting) =>
          new Date(row.updatedAt).toLocaleDateString('fr-FR'),
      },
      {
        key: 'actions',
        header: '',
        className: 'w-28 text-right',
        render: (row: SystemSetting) => (
          <CrudActions
            onEdit={() => {
              setEditing(row)
              setModalOpen(true)
            }}
            onDelete={() => setDeleting(row)}
          />
        ),
      },
    ],
    [],
  )

  return (
    <div>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Système</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            {filtered.length} paramètre(s)
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditing(undefined)
            setModalOpen(true)
          }}
        >
          + Ajouter
        </Button>
      </div>

      <TableFilters
        configs={filterConfig}
        values={filters}
        onChange={setFilter}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
        className="mb-3"
      />

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(row) => row.id}
        emptyMessage="Aucun paramètre ne correspond aux filtres"
      />

      <SystemSettingFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(undefined)
        }}
        setting={editing}
        categories={categories}
        onSubmit={(values) => {
          const today = new Date().toISOString().slice(0, 10)
          if (editing) {
            dispatch(
              updateSystemSetting({
                id: editing.id,
                data: { ...values, updatedAt: today },
              }),
            )
          } else {
            dispatch(
              addSystemSetting({
                id: createId('sys'),
                ...values,
                updatedAt: today,
              }),
            )
          }
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Supprimer le paramètre"
        message={`Supprimer « ${deleting?.name} » ?`}
        onConfirm={() => {
          if (deleting) dispatch(deleteSystemSetting(deleting.id))
          setDeleting(undefined)
        }}
        onCancel={() => setDeleting(undefined)}
      />
    </div>
  )
}
