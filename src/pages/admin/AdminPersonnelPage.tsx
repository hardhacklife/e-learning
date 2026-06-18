import { useMemo, useState } from 'react'
import { useAppSelector } from '@/app/hooks'
import { PersonnelCategoryPanel } from '@/features/admin/components/PersonnelCategoryPanel'
import { PersonnelCategoryTabs } from '@/features/admin/components/PersonnelCategoryTabs'
import { PERSONNEL_CATEGORIES } from '@/features/admin/config/personnelCategories'
import { useAdminCategoryCounts } from '@/features/admin/hooks/useAdminCategoryCounts'
import { selectAdminPersonnel } from '@/features/admin/slice/adminSlice'
import type { PersonnelCategory } from '@/mocks/data/adminPersonnel'

export function AdminPersonnelPage() {
  const mockPersonnel = useAppSelector(selectAdminPersonnel)
  const [category, setCategory] = useState<PersonnelCategory>('administratif')

  const mockCounts = useMemo(() => {
    const map = {} as Record<PersonnelCategory, number>
    for (const cat of PERSONNEL_CATEGORIES) {
      map[cat.id] = mockPersonnel.filter((p) => p.category === cat.id).length
    }
    return map
  }, [mockPersonnel])

  const { counts, isLoading } = useAdminCategoryCounts(mockCounts)

  const total = useMemo(
    () => Object.values(counts).reduce((sum, n) => sum + n, 0),
    [counts],
  )

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-slate-900">Utilisateurs</h1>
        <p className="mt-0.5 text-xs text-slate-500">
          Gestion par catégorie via l&apos;API — {isLoading ? '…' : total} compte
          {total > 1 ? 's' : ''} au total
        </p>
      </div>

      <PersonnelCategoryTabs
        active={category}
        onChange={setCategory}
        counts={counts}
      />

      <PersonnelCategoryPanel key={category} category={category} />
    </div>
  )
}
