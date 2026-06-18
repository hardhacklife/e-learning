import { useCallback, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  formatBytes,
  formatDaysLeft,
  formatDepositDate,
  getDepositStatus,
  getFileExtension,
  type DepositStatus,
} from '@/features/formations/utils/depositUtils'
import type {
  FormationProjectDeposit,
  FormationSubmittedFile,
} from '@/types/formation'

const statusLabels: Record<
  DepositStatus,
  { label: string; className: string }
> = {
  open: { label: 'Ouvert', className: 'text-emerald-600 bg-emerald-50' },
  closed: { label: 'Fermé', className: 'text-slate-500 bg-slate-100' },
  upcoming: { label: 'Bientôt', className: 'text-amber-600 bg-amber-50' },
}

interface DepositSpaceCardProps {
  deposit: FormationProjectDeposit
  extraFiles: FormationSubmittedFile[]
  onUpload: (depositId: string, files: File[]) => string | null
  onRemove: (depositId: string, fileId: string) => void
}

function DepositSpaceCard({
  deposit,
  extraFiles,
  onUpload,
  onRemove,
}: DepositSpaceCardProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const status = getDepositStatus(deposit)
  const statusInfo = statusLabels[status]
  const daysLeft = status === 'open' ? formatDaysLeft(deposit.deadline) : null
  const allFiles = [...deposit.submittedFiles, ...extraFiles]
  const canUpload = status === 'open' && allFiles.length < deposit.maxFiles
  const accept = deposit.allowedExtensions.map((ext) => `.${ext}`).join(',')

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList?.length) return
      setError(null)
      const err = onUpload(deposit.id, Array.from(fileList))
      if (err) setError(err)
    },
    [deposit.id, onUpload],
  )

  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900">
              {deposit.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              {deposit.description}
            </p>
          </div>
          <span
            className={cn(
              'shrink-0 rounded-md px-2 py-0.5 text-xs font-medium',
              statusInfo.className,
            )}
          >
            {statusInfo.label}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          <span>
            Ouverture : {formatDepositDate(deposit.opensAt)}
          </span>
          <span>
            Date limite : {formatDepositDate(deposit.deadline)}
          </span>
          {daysLeft && (
            <span className="font-medium text-emerald-600">{daysLeft}</span>
          )}
        </div>
      </div>

      <div className="px-4 py-3">
        {status === 'upcoming' && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
            L&apos;espace de dépôt sera accessible à partir du{' '}
            {formatDepositDate(deposit.opensAt)}.
          </p>
        )}

        {status === 'closed' && allFiles.length === 0 && (
          <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
            La date limite est dépassée. Aucun fichier n&apos;a été déposé.
          </p>
        )}

        {canUpload && (
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
            }}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              handleFiles(e.dataTransfer.files)
            }}
            onClick={() => inputRef.current?.click()}
            className={cn(
              'cursor-pointer rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors',
              dragOver
                ? 'border-primary-400 bg-primary-50'
                : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50',
            )}
          >
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={accept}
              className="hidden"
              onChange={(e) => {
                handleFiles(e.target.files)
                e.target.value = ''
              }}
            />
            <p className="text-sm font-medium text-slate-700">
              Déposer vos fichiers
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Glissez-déposez ou cliquez pour sélectionner
            </p>
            <p className="mt-2 text-[10px] text-slate-400">
              {deposit.allowedExtensions.map((e) => `.${e}`).join(', ')} · max{' '}
              {deposit.maxFileSizeMb} Mo · {deposit.maxFiles - allFiles.length}{' '}
              fichier(s) restant(s)
            </p>
          </div>
        )}

        {error && (
          <p className="mt-2 text-xs text-rose-600">{error}</p>
        )}

        {allFiles.length > 0 && (
          <ul className="mt-3 space-y-2">
            {allFiles.map((file) => {
              const isLocal = extraFiles.some((f) => f.id === file.id)
              return (
                <li
                  key={file.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {file.size} ·{' '}
                      {new Date(file.uploadedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {isLocal && canUpload && (
                    <button
                      type="button"
                      onClick={() => onRemove(deposit.id, file.id)}
                      className="shrink-0 text-xs text-slate-400 hover:text-rose-600"
                    >
                      Retirer
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}

      </div>
    </div>
  )
}

interface ProjectDepositPanelProps {
  deposits: FormationProjectDeposit[]
}

export function ProjectDepositPanel({ deposits }: ProjectDepositPanelProps) {
  const [localFiles, setLocalFiles] = useState<
    Record<string, FormationSubmittedFile[]>
  >({})

  const handleUpload = useCallback(
    (depositId: string, files: File[]): string | null => {
      const deposit = deposits.find((d) => d.id === depositId)
      if (!deposit) return 'Espace introuvable.'

      const status = getDepositStatus(deposit)
      if (status !== 'open') return "L'espace de dépôt n'est pas ouvert."

      const existing = [
        ...deposit.submittedFiles,
        ...(localFiles[depositId] ?? []),
      ]
      const remaining = deposit.maxFiles - existing.length
      if (remaining <= 0) {
        return `Maximum ${deposit.maxFiles} fichier(s) autorisé(s).`
      }

      const toAdd = files.slice(0, remaining)
      const newFiles: FormationSubmittedFile[] = []

      for (const file of toAdd) {
        const ext = getFileExtension(file.name)
        if (!deposit.allowedExtensions.includes(ext)) {
          return `Extension .${ext} non autorisée.`
        }
        if (file.size > deposit.maxFileSizeMb * 1024 * 1024) {
          return `Fichier trop volumineux (max ${deposit.maxFileSizeMb} Mo).`
        }
        newFiles.push({
          id: `local-${depositId}-${Date.now()}-${file.name}`,
          name: file.name,
          size: formatBytes(file.size),
          uploadedAt: new Date().toISOString(),
        })
      }

      setLocalFiles((prev) => ({
        ...prev,
        [depositId]: [...(prev[depositId] ?? []), ...newFiles],
      }))
      return null
    },
    [deposits, localFiles],
  )

  const handleRemove = useCallback((depositId: string, fileId: string) => {
    setLocalFiles((prev) => ({
      ...prev,
      [depositId]: (prev[depositId] ?? []).filter((f) => f.id !== fileId),
    }))
  }, [])

  if (deposits.length === 0) return null

  return (
    <div>
      <h2 className="mb-1 text-base font-semibold text-slate-900">
        Dépôt de projets
      </h2>
      <p className="mb-3 text-xs text-slate-500">
        Espaces ouverts par le formateur — déposez vos fichiers avant la date
        limite.
      </p>
      <div className="space-y-3">
        {deposits.map((deposit) => (
          <DepositSpaceCard
            key={deposit.id}
            deposit={deposit}
            extraFiles={localFiles[deposit.id] ?? []}
            onUpload={handleUpload}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  )
}
