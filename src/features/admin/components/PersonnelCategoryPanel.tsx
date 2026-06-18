import { useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { DataTable } from '@/components/shared/table/DataTable'
import { TableFilters } from '@/components/shared/table/TableFilters'
import { useTableFilters } from '@/components/shared/table/useTableFilters'
import {
  useCreateMemberMutation,
  useDeleteMemberMutation,
  useGetCategoryMembersQuery,
  useUpdateMemberMutation,
} from '@/features/admin/api/adminApi'
import { getCategoryConfig } from '@/features/admin/config/personnelCategories'
import { PersonnelCategoryFormModal } from '@/features/admin/components/PersonnelCategoryFormModal'
import { getPersonnelColumns } from '@/features/admin/utils/personnelTableColumns'
import {
  addPersonnel,
  deletePersonnel,
  selectAdminPersonnel,
  updatePersonnel,
} from '@/features/admin/slice/adminSlice'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ConfirmDialog } from '@/features/formations/components/ConfirmDialog'
import { createId } from '@/lib/createId'
import {
  buildCategoryFilterConfig,
  filterPersonnelInCategory,
  type AdminPersonnel,
  type PersonnelCategory,
} from '@/mocks/data/adminPersonnel'
import { getApiErrorMessage } from '@/features/admin/utils/apiError'
import { UserRole } from '@/types/roles'

const useMock = import.meta.env.VITE_USE_MOCK !== 'false'

interface PersonnelCategoryPanelProps {
  category: PersonnelCategory
}

export function PersonnelCategoryPanel({ category }: PersonnelCategoryPanelProps) {
  const dispatch = useAppDispatch()
  const { hasRole } = useAuth()
  const isAdmin = hasRole(UserRole.ADMIN)
  const mockPersonnel = useAppSelector(selectAdminPersonnel)
  const config = getCategoryConfig(category)

  const {
    data: apiMembers = [],
    isLoading,
    isError,
  } = useGetCategoryMembersQuery(category, { skip: useMock })

  const [createMember, { isLoading: isCreating }] = useCreateMemberMutation()
  const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation()
  const [deleteMember] = useDeleteMemberMutation()

  const categoryItems = useMemo(() => {
    if (useMock) {
      return mockPersonnel.filter((p) => p.category === category)
    }
    return apiMembers
  }, [mockPersonnel, apiMembers, category])

  const filterConfig = useMemo(
    () => buildCategoryFilterConfig(category, categoryItems),
    [category, categoryItems],
  )

  const filterPredicate = useMemo(
    () => (row: AdminPersonnel, filters: Record<string, string>) =>
      filterPersonnelInCategory(row, filters, category),
    [category],
  )

  const { filters, setFilter, resetFilters, filtered, hasActiveFilters } =
    useTableFilters(categoryItems, filterConfig, filterPredicate)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<AdminPersonnel | undefined>()
  const [deleting, setDeleting] = useState<AdminPersonnel | undefined>()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const columns = useMemo(
    () =>
      getPersonnelColumns(
        category,
        (row) => {
          setEditing(row)
          setModalOpen(true)
        },
        setDeleting,
        isAdmin,
      ),
    [category, isAdmin],
  )

  const handleCreate = async (values: AdminPersonnel, password: string) => {
    setSubmitError(null)

    if (useMock) {
      dispatch(addPersonnel({ ...values, id: createId('p') }))
      return
    }

    try {
      await createMember({ values, password }).unwrap()
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(
          error as Parameters<typeof getApiErrorMessage>[0],
          'Impossible de créer le compte. Vérifiez les champs et vos droits administrateur.',
        ),
      )
      throw new Error('create-member-failed')
    }
  }

  const handleUpdate = async (values: AdminPersonnel, password?: string) => {
    if (!editing) return

    setSubmitError(null)

    if (useMock) {
      dispatch(updatePersonnel({ id: editing.id, data: values }))
      return
    }

    try {
      await updateMember({ values, password }).unwrap()
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(
          error as Parameters<typeof getApiErrorMessage>[0],
          'Impossible de modifier le compte. Vérifiez les champs et vos droits administrateur.',
        ),
      )
      throw new Error('update-member-failed')
    }
  }

  const handleDelete = async () => {
    if (!deleting) return

    setDeleteError(null)

    if (useMock) {
      dispatch(deletePersonnel(deleting.id))
      setDeleting(undefined)
      return
    }

    try {
      await deleteMember({ id: deleting.id, category }).unwrap()
      setDeleting(undefined)
    } catch (error) {
      setDeleteError(
        getApiErrorMessage(
          error as Parameters<typeof getApiErrorMessage>[0],
          'Impossible de supprimer ce compte.',
        ),
      )
    }
  }

  if (!useMock && isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="text-xs text-slate-500">
          {config.description} — {filtered.length} / {categoryItems.length}
          {!useMock && (
            <span className="mt-1 block text-slate-400">
              Données chargées depuis{' '}
              <code className="text-slate-600">{config.apiLabel}</code>
            </span>
          )}
        </p>
        {isAdmin && (
          <Button
            size="sm"
            onClick={() => {
              setSubmitError(null)
              setEditing(undefined)
              setModalOpen(true)
            }}
          >
            + Ajouter
          </Button>
        )}
      </div>

      {!useMock && isError && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          Impossible de charger les données depuis l&apos;API.
        </p>
      )}

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
        emptyMessage={`Aucun profil ${config.label.toLowerCase()} trouvé`}
      />

      <PersonnelCategoryFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(undefined)
          setSubmitError(null)
        }}
        category={category}
        personnel={editing}
        isSubmitting={isCreating || isUpdating}
        submitError={submitError}
        allowEdit={isAdmin}
        onSubmit={async (values, password) => {
          if (editing) {
            await handleUpdate(values, password)
            return
          }
          await handleCreate(values, password ?? '')
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Supprimer"
        message={
          deleteError
            ? deleteError
            : `Retirer définitivement ${deleting?.firstName} ${deleting?.lastName} ? Cette action est irréversible.`
        }
        onConfirm={() => void handleDelete()}
        onCancel={() => {
          setDeleteError(null)
          setDeleting(undefined)
        }}
      />
    </div>
  )
}
