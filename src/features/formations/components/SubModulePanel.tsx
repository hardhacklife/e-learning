import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { QuizListItem } from '@/features/formations/components/QuizListItem'
import type {
  FormationDocument,
  FormationResource,
  FormationSubModule,
} from '@/types/formation'

const docTypeLabels: Record<FormationDocument['type'], string> = {
  pdf: 'PDF',
  doc: 'Document',
  slide: 'Diapositive',
}

const resourceTypeLabels: Record<FormationResource['type'], string> = {
  video: 'Vidéo',
  link: 'Lien',
  article: 'Article',
  exercise: 'Exercice',
}

interface SubModulePanelProps {
  subModule: FormationSubModule
  formationId: string
  defaultOpen?: boolean
  viewMode?: 'student' | 'trainer'
}

interface ContentSectionProps {
  title: string
  count: number
  emptyText: string
  children: ReactNode
}

function ContentSection({ title, count, emptyText, children }: ContentSectionProps) {
  return (
    <div className="border-l border-slate-200 pl-5">
      <div className="flex items-baseline justify-between">
        <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
        <span className="text-xs text-slate-400">{count}</span>
      </div>

      {count === 0 ? (
        <p className="ml-5 border-l border-slate-100 py-2 pl-4 text-sm text-slate-400">
          {emptyText}
        </p>
      ) : (
        <ul className="ml-5 mt-2 space-y-0 border-l border-slate-100 pl-4">
          {children}
        </ul>
      )}
    </div>
  )
}

function ListRow({
  title,
  meta,
  badge,
}: {
  title: string
  meta?: string
  badge?: { label: string; className: string }
}) {
  return (
    <li className="relative py-2.5 pl-3 before:absolute before:-left-4 before:top-[1.25rem] before:h-px before:w-2.5 before:bg-slate-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-800">{title}</p>
          {meta && <p className="mt-1 pl-2 text-xs text-slate-500">{meta}</p>}
        </div>
        {badge && (
          <span className={cn('shrink-0 text-xs font-medium', badge.className)}>
            {badge.label}
          </span>
        )}
      </div>
    </li>
  )
}

export function SubModulePanel({
  subModule,
  formationId,
  defaultOpen = false,
  viewMode = 'student',
}: SubModulePanelProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-sm font-bold text-primary-700">
            {subModule.order}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-slate-900">
              {subModule.title}
            </h3>
            <p className="text-xs text-slate-500">
              {subModule.documents.length} documents · {subModule.quizzes.length} quiz ·{' '}
              {subModule.resources.length} ressources
            </p>
          </div>
        </div>
        <svg
          className={cn(
            'h-5 w-5 shrink-0 text-slate-400 transition-transform',
            open && 'rotate-180',
          )}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="border-t border-slate-100 px-4 py-4">
          <p className="border-l-2 border-primary-200 pl-4 text-sm leading-relaxed text-slate-600">
            {subModule.description}
          </p>

          <div className="ml-4 mt-5 space-y-5 border-l-2 border-slate-200 pl-5">
            <ContentSection
              title="Documents"
              count={subModule.documents.length}
              emptyText="Aucun document"
            >
              {subModule.documents.map((doc) => (
                <ListRow
                  key={doc.id}
                  title={doc.title}
                  meta={[docTypeLabels[doc.type], doc.size].filter(Boolean).join(' · ')}
                />
              ))}
            </ContentSection>

            <ContentSection
              title="Quiz"
              count={subModule.quizzes.length}
              emptyText="Aucun quiz"
            >
              {subModule.quizzes.map((quiz) => (
                <QuizListItem
                  key={quiz.id}
                  quiz={quiz}
                  formationId={formationId}
                  viewMode={viewMode}
                />
              ))}
            </ContentSection>

            <ContentSection
              title="Ressources"
              count={subModule.resources.length}
              emptyText="Aucune ressource"
            >
              {subModule.resources.map((res) => (
                <ListRow
                  key={res.id}
                  title={res.title}
                  meta={[resourceTypeLabels[res.type], res.duration]
                    .filter(Boolean)
                    .join(' · ')}
                />
              ))}
            </ContentSection>
          </div>
        </div>
      )}
    </div>
  )
}
