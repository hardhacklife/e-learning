export type SystemSettingStatus = 'enabled' | 'disabled' | 'warning'

export interface SystemSetting {
  id: string
  category: string
  name: string
  value: string
  status: SystemSettingStatus
  updatedAt: string
}

export const SYSTEM_STATUS_LABELS: Record<SystemSettingStatus, string> = {
  enabled: 'Actif',
  disabled: 'Désactivé',
  warning: 'Attention',
}

export const MOCK_SYSTEM_SETTINGS: SystemSetting[] = [
  {
    id: 'sys-001',
    category: 'Sécurité',
    name: 'Authentification JWT',
    value: 'Activée — expiration 24h',
    status: 'enabled',
    updatedAt: '2026-06-01',
  },
  {
    id: 'sys-002',
    category: 'Sécurité',
    name: 'Politique mots de passe',
    value: 'Min. 8 caractères, BCrypt',
    status: 'enabled',
    updatedAt: '2026-05-15',
  },
  {
    id: 'sys-003',
    category: 'Sécurité',
    name: 'Double authentification',
    value: 'Désactivée',
    status: 'disabled',
    updatedAt: '2026-04-20',
  },
  {
    id: 'sys-004',
    category: 'Plateforme',
    name: 'Mode maintenance',
    value: 'Désactivé',
    status: 'enabled',
    updatedAt: '2026-06-08',
  },
  {
    id: 'sys-005',
    category: 'Plateforme',
    name: 'Inscriptions ouvertes',
    value: 'Licence 2 & 3',
    status: 'enabled',
    updatedAt: '2026-06-05',
  },
  {
    id: 'sys-006',
    category: 'Plateforme',
    name: 'Limite stockage / utilisateur',
    value: '500 Mo',
    status: 'enabled',
    updatedAt: '2026-03-10',
  },
  {
    id: 'sys-007',
    category: 'Notifications',
    name: 'Emails transactionnels',
    value: 'SMTP UCHK — smtp.uchk.sn',
    status: 'enabled',
    updatedAt: '2026-05-28',
  },
  {
    id: 'sys-008',
    category: 'Notifications',
    name: 'Alertes administrateur',
    value: 'admin@uchk.sn',
    status: 'warning',
    updatedAt: '2026-06-09',
  },
  {
    id: 'sys-009',
    category: 'Sauvegarde',
    name: 'Sauvegarde automatique',
    value: 'Quotidienne — 02h00',
    status: 'enabled',
    updatedAt: '2026-06-10',
  },
  {
    id: 'sys-010',
    category: 'Sauvegarde',
    name: 'Rétention des logs',
    value: '90 jours',
    status: 'enabled',
    updatedAt: '2026-01-15',
  },
]

export function filterSystemSettings(
  row: SystemSetting,
  filters: Record<string, string>,
): boolean {
  const q = filters.search?.toLowerCase().trim() ?? ''
  if (q) {
    const haystack = [row.name, row.value, row.category].join(' ').toLowerCase()
    if (!haystack.includes(q)) return false
  }
  if (filters.category && row.category !== filters.category) return false
  if (filters.status && row.status !== filters.status) return false
  return true
}

export function buildSystemFilterConfig(settings: SystemSetting[]) {
  return [
    {
      id: 'search',
      label: 'Recherche',
      type: 'search' as const,
      placeholder: 'Paramètre, valeur...',
    },
    {
      id: 'category',
      label: 'Catégorie',
      type: 'select' as const,
      defaultValue: '',
      options: [
        { value: '', label: 'Toutes' },
        ...Array.from(new Set(settings.map((s) => s.category)))
          .sort()
          .map((c) => ({ value: c, label: c })),
      ],
    },
    {
      id: 'status',
      label: 'État',
      type: 'select' as const,
      defaultValue: '',
      options: [
        { value: '', label: 'Tous' },
        { value: 'enabled', label: 'Actif' },
        { value: 'disabled', label: 'Désactivé' },
        { value: 'warning', label: 'Attention' },
      ],
    },
  ]
}
