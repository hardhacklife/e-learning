import { cn } from '@/lib/utils'
import { PERSONNEL_CATEGORIES } from '@/features/admin/config/personnelCategories'
import type { PersonnelCategory } from '@/mocks/data/adminPersonnel'

interface PersonnelCategoryTabsProps {
  active: PersonnelCategory
  onChange: (category: PersonnelCategory) => void
  counts: Record<PersonnelCategory, number>
}

export function PersonnelCategoryTabs({
  active,
  onChange,
  counts,
}: PersonnelCategoryTabsProps) {
  return (
    <nav className="mb-4 flex flex-wrap gap-1 border-b border-slate-100">
      {PERSONNEL_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.id)}
          className={cn(
            'border-b-2 px-3 py-2 text-xs font-medium transition-colors -mb-px',
            active === cat.id
              ? 'border-primary-600 text-primary-700'
              : 'border-transparent text-slate-500 hover:text-slate-800',
          )}
        >
          {cat.label}
          <span className="ml-1 text-slate-400">({counts[cat.id] ?? 0})</span>
        </button>
      ))}
    </nav>
  )
}
