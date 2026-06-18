import { useState, type ReactNode } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { ConfirmDialog } from '@/features/formations/components/ConfirmDialog'
import { CrudActions } from '@/features/formations/components/CrudActions'
import { DocumentFormModal } from '@/features/formations/components/DocumentFormModal'
import { QuizFormModal } from '@/features/formations/components/QuizFormModal'
import { ResourceFormModal } from '@/features/formations/components/ResourceFormModal'
import { SubModuleFormModal } from '@/features/formations/components/SubModuleFormModal'
import { SubModuleInfoTab } from '@/features/formations/components/SubModuleInfoTab'
import { SubModuleNotesTab } from '@/features/formations/components/SubModuleNotesTab'
import {
  addDocument,
  addQuiz,
  addResource,
  deleteDocument,
  deleteQuiz,
  deleteResource,
  deleteSubModule,
  updateDocument,
  updateQuiz,
  updateResource,
  updateSubModule,
} from '@/features/formations/slice/formationsSlice'
import { createId } from '@/lib/createId'
import { cn } from '@/lib/utils'
import type {
  FormationDocument,
  FormationQuiz,
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

const quizStatusLabels: Record<
  FormationQuiz['status'],
  { label: string; className: string }
> = {
  available: { label: 'Disponible', className: 'text-emerald-600' },
  completed: { label: 'Terminé', className: 'text-primary-600' },
  locked: { label: 'Verrouillé', className: 'text-slate-400' },
}

type SubModuleTab = 'detail' | 'notes' | 'infos'

const SUB_MODULE_TABS: { id: SubModuleTab; label: string }[] = [
  { id: 'detail', label: 'Détail' },
  { id: 'notes', label: 'Notes' },
  { id: 'infos', label: 'Infos' },
]

interface TrainerSubModulePanelProps {
  subModule: FormationSubModule
  formationId: string
  enrolledStudentIds: string[]
  defaultOpen?: boolean
}

interface ContentSectionProps {
  title: string
  count: number
  onAdd: () => void
  emptyText: string
  children: ReactNode
}

function ContentSection({
  title,
  count,
  onAdd,
  emptyText,
  children,
}: ContentSectionProps) {
  return (
    <div className="border-l border-slate-200 pl-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
          <span className="text-xs text-slate-400">{count}</span>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="text-xs font-medium text-primary-600 hover:text-primary-700"
        >
          + Ajouter
        </button>
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

export function TrainerSubModulePanel({
  subModule,
  formationId,
  enrolledStudentIds,
  defaultOpen = false,
}: TrainerSubModulePanelProps) {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(defaultOpen)
  const [activeTab, setActiveTab] = useState<SubModuleTab>('detail')
  const studentNotes = subModule.studentNotes ?? []

  const [subModal, setSubModal] = useState(false)
  const [docModal, setDocModal] = useState<FormationDocument | null | 'new'>(null)
  const [quizModal, setQuizModal] = useState<FormationQuiz | null | 'new'>(null)
  const [resModal, setResModal] = useState<FormationResource | null | 'new'>(null)
  const [deleteTarget, setDeleteTarget] = useState<
    | { type: 'subModule' }
    | { type: 'document'; id: string; title: string }
    | { type: 'quiz'; id: string; title: string }
    | { type: 'resource'; id: string; title: string }
    | null
  >(null)

  const confirmDelete = () => {
    if (!deleteTarget) return
    switch (deleteTarget.type) {
      case 'subModule':
        dispatch(deleteSubModule({ formationId, subModuleId: subModule.id }))
        break
      case 'document':
        dispatch(
          deleteDocument({
            formationId,
            subModuleId: subModule.id,
            documentId: deleteTarget.id,
          }),
        )
        break
      case 'quiz':
        dispatch(
          deleteQuiz({
            formationId,
            subModuleId: subModule.id,
            quizId: deleteTarget.id,
          }),
        )
        break
      case 'resource':
        dispatch(
          deleteResource({
            formationId,
            subModuleId: subModule.id,
            resourceId: deleteTarget.id,
          }),
        )
        break
    }
    setDeleteTarget(null)
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center gap-2 px-4 py-3">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left transition-colors hover:text-primary-700"
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
                  {subModule.documents.length} documents · {subModule.quizzes.length}{' '}
                  quiz · {subModule.resources.length} ressources
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
          <CrudActions
            onEdit={() => setSubModal(true)}
            onDelete={() => setDeleteTarget({ type: 'subModule' })}
          />
        </div>

        {open && (
          <div className="border-t border-slate-100 px-4 py-4">
            <p className="border-l-2 border-primary-200 pl-4 text-sm leading-relaxed text-slate-600">
              {subModule.description}
            </p>

            <nav className="mt-4 flex gap-1 border-b border-slate-100">
              {SUB_MODULE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'border-b-2 px-3 py-2 text-xs font-medium transition-colors -mb-px',
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800',
                  )}
                >
                  {tab.label}
                  {tab.id === 'notes' && studentNotes.length > 0 && (
                    <span className="ml-1 text-slate-400">
                      ({studentNotes.length})
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {activeTab === 'notes' && (
              <div className="mt-4">
                <SubModuleNotesTab
                  formationId={formationId}
                  subModuleId={subModule.id}
                  enrolledStudentIds={enrolledStudentIds}
                  studentNotes={studentNotes}
                />
              </div>
            )}

            {activeTab === 'infos' && (
              <div className="mt-4">
                <SubModuleInfoTab
                  formationId={formationId}
                  subModuleId={subModule.id}
                  teacherInfo={subModule.teacherInfo}
                  studentNotes={studentNotes}
                  enrolledCount={enrolledStudentIds.length}
                />
              </div>
            )}

            {activeTab === 'detail' && (
            <div className="ml-4 mt-5 space-y-5 border-l-2 border-slate-200 pl-5">
              <ContentSection
                title="Documents"
                count={subModule.documents.length}
                onAdd={() => setDocModal('new')}
                emptyText="Aucun document"
              >
                {subModule.documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="relative flex items-start justify-between gap-2 py-2.5 pl-3 before:absolute before:-left-4 before:top-[1.25rem] before:h-px before:w-2.5 before:bg-slate-200"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800">{doc.title}</p>
                      <p className="mt-1 pl-2 text-xs text-slate-500">
                        {[docTypeLabels[doc.type], doc.size].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <CrudActions
                      onEdit={() => setDocModal(doc)}
                      onDelete={() =>
                        setDeleteTarget({
                          type: 'document',
                          id: doc.id,
                          title: doc.title,
                        })
                      }
                    />
                  </li>
                ))}
              </ContentSection>

              <ContentSection
                title="Quiz"
                count={subModule.quizzes.length}
                onAdd={() => setQuizModal('new')}
                emptyText="Aucun quiz"
              >
                {subModule.quizzes.map((quiz) => {
                  const status = quizStatusLabels[quiz.status]
                  return (
                    <li
                      key={quiz.id}
                      className="relative flex items-start justify-between gap-2 py-2.5 pl-3 before:absolute before:-left-4 before:top-[1.25rem] before:h-px before:w-2.5 before:bg-slate-200"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800">{quiz.title}</p>
                        <p className="mt-1 pl-2 text-xs text-slate-500">
                          {quiz.questionsCount} questions · {quiz.duration}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={cn('text-xs font-medium', status.className)}>
                          {status.label}
                        </span>
                        <CrudActions
                          onEdit={() => setQuizModal(quiz)}
                          onDelete={() =>
                            setDeleteTarget({
                              type: 'quiz',
                              id: quiz.id,
                              title: quiz.title,
                            })
                          }
                        />
                      </div>
                    </li>
                  )
                })}
              </ContentSection>

              <ContentSection
                title="Ressources"
                count={subModule.resources.length}
                onAdd={() => setResModal('new')}
                emptyText="Aucune ressource"
              >
                {subModule.resources.map((res) => (
                  <li
                    key={res.id}
                    className="relative flex items-start justify-between gap-2 py-2.5 pl-3 before:absolute before:-left-4 before:top-[1.25rem] before:h-px before:w-2.5 before:bg-slate-200"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800">{res.title}</p>
                      <p className="mt-1 pl-2 text-xs text-slate-500">
                        {[resourceTypeLabels[res.type], res.duration]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    </div>
                    <CrudActions
                      onEdit={() => setResModal(res)}
                      onDelete={() =>
                        setDeleteTarget({
                          type: 'resource',
                          id: res.id,
                          title: res.title,
                        })
                      }
                    />
                  </li>
                ))}
              </ContentSection>
            </div>
            )}
          </div>
        )}
      </div>

      <SubModuleFormModal
        open={subModal}
        onClose={() => setSubModal(false)}
        subModule={subModule}
        onSubmit={(values) =>
          dispatch(
            updateSubModule({
              formationId,
              subModuleId: subModule.id,
              data: values,
            }),
          )
        }
      />

      <DocumentFormModal
        open={docModal !== null}
        onClose={() => setDocModal(null)}
        document={docModal && docModal !== 'new' ? docModal : undefined}
        onSubmit={(values) => {
          if (docModal === 'new') {
            dispatch(
              addDocument({
                formationId,
                subModuleId: subModule.id,
                document: { id: createId('doc'), ...values },
              }),
            )
          } else if (docModal) {
            dispatch(
              updateDocument({
                formationId,
                subModuleId: subModule.id,
                documentId: docModal.id,
                data: values,
              }),
            )
          }
        }}
      />

      <QuizFormModal
        open={quizModal !== null}
        onClose={() => setQuizModal(null)}
        quiz={quizModal && quizModal !== 'new' ? quizModal : undefined}
        formations={[]}
        selectedFormationId={formationId}
        selectedSubModuleId={subModule.id}
        onSubModuleChange={() => {}}
        onSubmit={(values) => {
          if (quizModal === 'new') {
            dispatch(
              addQuiz({
                formationId,
                subModuleId: subModule.id,
                quiz: { id: createId('quiz'), ...values },
              }),
            )
          } else if (quizModal) {
            dispatch(
              updateQuiz({
                formationId,
                subModuleId: subModule.id,
                quizId: quizModal.id,
                data: values,
              }),
            )
          }
        }}
      />

      <ResourceFormModal
        open={resModal !== null}
        onClose={() => setResModal(null)}
        resource={resModal && resModal !== 'new' ? resModal : undefined}
        onSubmit={(values) => {
          if (resModal === 'new') {
            dispatch(
              addResource({
                formationId,
                subModuleId: subModule.id,
                resource: {
                  id: createId('res'),
                  ...values,
                  duration: values.duration || undefined,
                },
              }),
            )
          } else if (resModal) {
            dispatch(
              updateResource({
                formationId,
                subModuleId: subModule.id,
                resourceId: resModal.id,
                data: {
                  ...values,
                  duration: values.duration || undefined,
                },
              }),
            )
          }
        }}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Confirmer la suppression"
        message={
          !deleteTarget
            ? ''
            : deleteTarget.type === 'subModule'
              ? `Supprimer le sous-module « ${subModule.title} » et tout son contenu ?`
              : `Supprimer « ${deleteTarget.title} » ?`
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}
