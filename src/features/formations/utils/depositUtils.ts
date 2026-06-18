import type { FormationProjectDeposit } from '@/types/formation'

export type DepositStatus = 'open' | 'closed' | 'upcoming'

export function getDepositStatus(
  deposit: FormationProjectDeposit,
  now = new Date(),
): DepositStatus {
  const opensAt = new Date(deposit.opensAt)
  const deadline = new Date(deposit.deadline)
  if (now < opensAt) return 'upcoming'
  if (now > deadline) return 'closed'
  return 'open'
}

export function formatDepositDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDaysLeft(deadline: string, now = new Date()) {
  const diff = new Date(deadline).getTime() - now.getTime()
  if (diff <= 0) return null
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return days === 1 ? '1 jour restant' : `${days} jours restants`
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1).replace('.', ',')} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} Mo`
}

export function getFileExtension(name: string) {
  const dot = name.lastIndexOf('.')
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : ''
}
