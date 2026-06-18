import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import type { FiliereModuleSummary } from '@/features/catalog/api/catalogApi'

interface ModuleCatalogCardProps {
  module: FiliereModuleSummary
  basePath?: string
}

export function ModuleCatalogCard({
  module,
  basePath = '/student/formations',
}: ModuleCatalogCardProps) {
  return (
    <Link
      to={`${basePath}/${module.id}`}
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-primary-200 hover:shadow-md"
    >
      <div className="mb-3 flex flex-wrap gap-1.5">
        {module.niveau && <Badge variant="info">{module.niveau}</Badge>}
        {module.typeFormation && <Badge>{module.typeFormation}</Badge>}
      </div>

      <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-primary-700">
        {module.titre}
      </h3>

      {module.slug && (
        <p className="mt-2 font-mono text-xs text-slate-400">{module.slug}</p>
      )}
    </Link>
  )
}
