import type { FilterValues, TableFilterConfig } from '@/components/shared/table/types'
import { cn } from '@/lib/utils'

interface TableFiltersProps {
  configs: TableFilterConfig[]
  values: FilterValues
  onChange: (id: string, value: string) => void
  onReset?: () => void
  hasActiveFilters?: boolean
  className?: string
}

const inputClass =
  'h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400/30'

export function TableFilters({
  configs,
  values,
  onChange,
  onReset,
  hasActiveFilters,
  className,
}: TableFiltersProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-end gap-2 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2.5',
        className,
      )}
    >
      {configs.map((config) => (
        <div key={config.id} className="min-w-[120px] flex-1 sm:max-w-[200px]">
          <label className="mb-0.5 block text-[10px] font-medium uppercase tracking-wide text-slate-400">
            {config.label}
          </label>
          {config.type === 'search' ? (
            <input
              type="search"
              value={values[config.id] ?? ''}
              onChange={(e) => onChange(config.id, e.target.value)}
              placeholder={config.placeholder ?? 'Rechercher...'}
              className={cn(inputClass, 'w-full')}
            />
          ) : (
            <select
              value={values[config.id] ?? ''}
              onChange={(e) => onChange(config.id, e.target.value)}
              className={cn(inputClass, 'w-full')}
            >
              {config.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}
      {hasActiveFilters && onReset && (
        <button
          type="button"
          onClick={onReset}
          className="h-8 shrink-0 px-2 text-xs text-slate-500 hover:text-slate-800"
        >
          Réinitialiser
        </button>
      )}
    </div>
  )
}
