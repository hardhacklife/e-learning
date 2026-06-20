export type NotificationType =
  | 'EMPLOI_DU_TEMPS'
  | 'MODULE_ASSIGNE'
  | 'BULLETIN'
  | 'ANNONCE'

export type PorteeNotification = 'FILIERE' | 'NIVEAU' | 'FILIERE_ET_NIVEAU'

export interface Notification {
  id: number
  titre: string
  message: string
  type: NotificationType
  lu: boolean
  dateCreation: string
  lien?: string | null
  referenceId?: number | null
}

export interface NotificationBroadcastInput {
  titre: string
  message: string
  portee: PorteeNotification
  filiereId?: number
  niveau?: string
  lien?: string
}

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  EMPLOI_DU_TEMPS: 'Emploi du temps',
  MODULE_ASSIGNE: 'Modules',
  BULLETIN: 'Bulletin',
  ANNONCE: 'Annonce',
}

export const PORTEE_NOTIFICATION_LABELS: Record<PorteeNotification, string> = {
  FILIERE: 'Filière uniquement',
  NIVEAU: 'Niveau uniquement',
  FILIERE_ET_NIVEAU: 'Filière et niveau',
}
