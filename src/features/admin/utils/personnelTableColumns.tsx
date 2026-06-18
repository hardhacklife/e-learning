import { Badge } from '@/components/ui/Badge'
import { CrudActions } from '@/features/formations/components/CrudActions'
import type { TableColumn } from '@/components/shared/table/types'
import {
  getPersonnelRoleLabel,
  PERSONNEL_STATUS_LABELS,
  type AdminPersonnel,
  type PersonnelCategory,
  type PersonnelStatus,
} from '@/mocks/data/adminPersonnel'

const statusVariant: Record<
  PersonnelStatus,
  'success' | 'warning' | 'default'
> = {
  active: 'success',
  pending: 'warning',
  inactive: 'default',
}

function nameCol(): TableColumn<AdminPersonnel> {
  return {
    key: 'name',
    header: 'Nom',
    render: (row) => (
      <div>
        <p className="font-medium text-slate-800">
          {row.firstName} {row.lastName}
        </p>
        <p className="text-xs text-slate-400">{row.email}</p>
      </div>
    ),
  }
}

function statusCol(): TableColumn<AdminPersonnel> {
  return {
    key: 'status',
    header: 'Statut',
    render: (row) => (
      <Badge variant={statusVariant[row.status]}>
        {PERSONNEL_STATUS_LABELS[row.status]}
      </Badge>
    ),
  }
}

function actionsCol(
  onEdit: (row: AdminPersonnel) => void,
  onDelete: (row: AdminPersonnel) => void,
  showActions: boolean,
): TableColumn<AdminPersonnel> | null {
  if (!showActions) return null

  return {
    key: 'actions',
    header: '',
    className: 'w-28 text-right',
    render: (row) => (
      <CrudActions onEdit={() => onEdit(row)} onDelete={() => onDelete(row)} />
    ),
  }
}

export function getPersonnelColumns(
  category: PersonnelCategory,
  onEdit: (row: AdminPersonnel) => void,
  onDelete: (row: AdminPersonnel) => void,
  showActions = true,
): TableColumn<AdminPersonnel>[] {
  const actions = actionsCol(onEdit, onDelete, showActions)

  switch (category) {
    case 'administratif':
      return [
        nameCol(),
        {
          key: 'role',
          header: 'Fonction',
          render: (row) => (
            <span className="text-xs text-slate-600">
              {getPersonnelRoleLabel(row.role)}
            </span>
          ),
        },
        {
          key: 'department',
          header: 'Service',
          render: (row) => (
            <span className="text-xs text-slate-600">{row.department ?? '—'}</span>
          ),
        },
        statusCol(),
        {
          key: 'joined',
          header: 'Arrivée',
          className: 'text-xs text-slate-500',
          render: (row) =>
            new Date(row.joinedAt).toLocaleDateString('fr-FR', {
              month: 'short',
              year: 'numeric',
            }),
        },
        ...(actions ? [actions] : []),
      ]
    case 'formation':
      return [
        nameCol(),
        {
          key: 'department',
          header: 'Pôle',
          render: (row) => (
            <span className="text-xs text-slate-600">{row.department ?? '—'}</span>
          ),
        },
        {
          key: 'modules',
          header: 'Modules',
          render: (row) => (
            <span className="text-xs text-slate-600">
              {row.modulesManaged ?? 0} module(s)
            </span>
          ),
        },
        statusCol(),
        ...(actions ? [actions] : []),
      ]
    case 'enseignant':
      return [
        nameCol(),
        {
          key: 'specialty',
          header: 'Spécialité',
          render: (row) => (
            <span className="text-xs text-slate-600">{row.specialty ?? '—'}</span>
          ),
        },
        {
          key: 'department',
          header: 'Département',
          render: (row) => (
            <span className="text-xs text-slate-600">{row.department ?? '—'}</span>
          ),
        },
        statusCol(),
        ...(actions ? [actions] : []),
      ]
    case 'tuteur':
      return [
        nameCol(),
        {
          key: 'group',
          header: 'Groupe',
          render: (row) => (
            <span className="text-xs text-slate-600">{row.tutorGroup ?? '—'}</span>
          ),
        },
        {
          key: 'students',
          header: 'Étudiants',
          render: (row) => (
            <span className="text-xs text-slate-600">
              {row.studentsFollowed ?? 0}
            </span>
          ),
        },
        statusCol(),
        ...(actions ? [actions] : []),
      ]
    case 'etudiant':
      return [
        nameCol(),
        {
          key: 'ine',
          header: 'INE',
          render: (row) => (
            <span className="font-mono text-xs text-slate-600">{row.ine ?? '—'}</span>
          ),
        },
        {
          key: 'program',
          header: 'Formation',
          render: (row) => (
            <span className="text-xs text-slate-600">{row.program ?? '—'}</span>
          ),
        },
        {
          key: 'promotion',
          header: 'Promotion',
          render: (row) => (
            <span className="text-xs text-slate-600">{row.promotion ?? '—'}</span>
          ),
        },
        statusCol(),
        ...(actions ? [actions] : []),
      ]
    case 'insertion':
      return [
        nameCol(),
        {
          key: 'zone',
          header: 'Zone partenaires',
          render: (row) => (
            <span className="text-xs text-slate-600">{row.partnerZone ?? '—'}</span>
          ),
        },
        {
          key: 'department',
          header: 'Service',
          render: (row) => (
            <span className="text-xs text-slate-600">{row.department ?? '—'}</span>
          ),
        },
        statusCol(),
        ...(actions ? [actions] : []),
      ]
  }
}
