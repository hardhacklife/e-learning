import { PageHeader } from '@/components/layout/PageHeader'
import { NotificationsPanel } from '@/features/notifications/components/NotificationsPanel'

export function StudentNotificationsPage() {
  return (
    <div className="min-w-0 w-full">
      <PageHeader
        title="Notifications"
        description="Emploi du temps, bulletins et annonces de l'établissement"
      />
      <NotificationsPanel emptyMessage="Aucune notification reçue pour le moment." />
    </div>
  )
}
