interface CrudActionsProps {
  onEdit: () => void
  onDelete: () => void
  size?: 'sm' | 'md'
}

export function CrudActions({ onEdit, onDelete, size = 'sm' }: CrudActionsProps) {
  const cls = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'

  return (
    <div className="flex shrink-0 gap-1">
      <button
        type="button"
        onClick={onEdit}
        className={`rounded-md border border-slate-200 font-medium text-slate-600 hover:bg-slate-50 ${cls}`}
      >
        Modifier
      </button>
      <button
        type="button"
        onClick={onDelete}
        className={`rounded-md border border-rose-100 font-medium text-rose-600 hover:bg-rose-50 ${cls}`}
      >
        Supprimer
      </button>
    </div>
  )
}
