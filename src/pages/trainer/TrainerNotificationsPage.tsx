import { PageHeader } from '@/components/layout/PageHeader'
import { NotificationsPanel } from '@/features/notifications/components/NotificationsPanel'

export function TrainerNotificationsPage() {
  return (
    <div className="min-w-0 w-full">
      <PageHeader
        title="Notifications"
        description="Modifications de votre emploi du temps et informations pédagogiques"
      />
      <NotificationsPanel emptyMessage="Aucune notification pour le moment." />
    </div>
  )
}
