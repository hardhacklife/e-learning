import type { ReactNode } from 'react'

export interface FilterOption {
  value: string
  label: string
}

export interface TableFilterConfig {
  id: string
  label: string
  type: 'search' | 'select'
  placeholder?: string
  options?: FilterOption[]
  defaultValue?: string
}

export interface TableColumn<T> {
  key: string
  header: string
  className?: string
  render: (row: T) => ReactNode
}

export type FilterValues = Record<string, string>
