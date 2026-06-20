import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import type { StudentFormation } from '@/types/formation'
import { resolveFormationImageUrl } from '@/features/formations/utils/catalogFormationBridge'

interface FormationCardProps {
  formation: StudentFormation
  basePath?: string
}

export function FormationCard({
  formation,
  basePath = '/student/formations',
}: FormationCardProps) {
  return (
    <Link
      to={`${basePath}/${formation.id}`}
      className="group flex flex-col overflow-hidden rounded-md border border-slate-100 bg-white shadow-none transition-all hover:border-primary-200 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={resolveFormationImageUrl(formation.imageUrl)}
          alt={formation.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1.5">
          <Badge variant="info">{formation.level}</Badge>
          <Badge>{formation.type}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-primary-700">
          {formation.title}
        </h3>

        <p className="mt-1.5 line-clamp-2 flex-1 text-xs text-slate-500">
          {formation.description}
        </p>

        <div className="mt-3 space-y-0.5 border-t border-slate-50 pt-3 text-xs text-slate-400">
          <p>{formation.trainerName}</p>
          <p>
            {formation.duration} · {formation.subModules.length} sous-modules
          </p>
        </div>
      </div>
    </Link>
  )
}
