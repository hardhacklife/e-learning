import { useMemo, useState } from 'react'
import type { FilterValues, TableFilterConfig } from '@/components/shared/table/types'

function getDefaults(configs: TableFilterConfig[]): FilterValues {
  return Object.fromEntries(
    configs.map((c) => [c.id, c.defaultValue ?? '']),
  )
}

export function useTableFilters<T>(
  data: T[],
  configs: TableFilterConfig[],
  predicate: (row: T, filters: FilterValues) => boolean,
) {
  const [filters, setFilters] = useState<FilterValues>(() => getDefaults(configs))

  const filtered = useMemo(
    () => data.filter((row) => predicate(row, filters)),
    [data, filters, predicate],
  )

  const setFilter = (id: string, value: string) => {
    setFilters((prev) => ({ ...prev, [id]: value }))
  }

  const resetFilters = () => setFilters(getDefaults(configs))

  const hasActiveFilters = configs.some(
    (c) => (filters[c.id] ?? '') !== (c.defaultValue ?? ''),
  )

  return { filters, setFilter, resetFilters, filtered, hasActiveFilters }
}
