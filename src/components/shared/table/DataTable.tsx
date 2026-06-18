import type { TableColumn } from '@/components/shared/table/types'
import { cn } from '@/lib/utils'

interface DataTableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  emptyMessage?: string
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'Aucun résultat',
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-200 py-10 text-center text-sm text-slate-400">
        {emptyMessage}
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-100">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-slate-100 bg-slate-50/80 text-xs text-slate-500">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn('px-3 py-2 font-medium', col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 bg-white">
          {data.map((row) => (
            <tr key={keyExtractor(row)} className="hover:bg-slate-50/50">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn('px-3 py-2.5 text-slate-700', col.className)}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
