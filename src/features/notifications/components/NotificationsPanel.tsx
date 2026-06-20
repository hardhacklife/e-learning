import { Link } from 'react-router-dom'
import {
  Calendar,
  ClipboardList,
  BookOpen,
  Megaphone,
  type LucideIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import {
  useGetMyNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from '@/features/notifications/api/notificationsApi'
import {
  NOTIFICATION_TYPE_LABELS,
  type Notification,
  type NotificationType,
} from '@/types/notifications'

const TYPE_ICONS: Record<NotificationType, LucideIcon> = {
  EMPLOI_DU_TEMPS: Calendar,
  MODULE_ASSIGNE: BookOpen,
  BULLETIN: ClipboardList,
  ANNONCE: Megaphone,
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso))
}

function NotificationItem({
  notification,
  onMarkRead,
  isMarking,
}: {
  notification: Notification
  onMarkRead: (id: number) => void
  isMarking: boolean
}) {
  const Icon = TYPE_ICONS[notification.type]

  return (
    <article
      className={`rounded-xl border px-4 py-4 transition-colors ${
        notification.lu
          ? 'border-slate-200 bg-white'
          : 'border-primary-200 bg-primary-50/40'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            notification.lu ? 'bg-slate-100 text-slate-600' : 'bg-primary-100 text-primary-700'
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900">{notification.titre}</h3>
            <Badge variant={notification.lu ? 'default' : 'info'}>
              {NOTIFICATION_TYPE_LABELS[notification.type]}
            </Badge>
            {!notification.lu && (
              <Badge variant="warning">Non lue</Badge>
            )}
          </div>
          <p className="mt-2 text-sm text-slate-600">{notification.message}</p>
          <p className="mt-2 text-xs text-slate-400">{formatDate(notification.dateCreation)}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {notification.lien && (
              <Link
                to={notification.lien}
                className="text-sm font-medium text-primary-700 hover:text-primary-800"
                onClick={() => {
                  if (!notification.lu) {
                    onMarkRead(notification.id)
                  }
                }}
              >
                Voir le détail →
              </Link>
            )}
            {!notification.lu && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isMarking}
                onClick={() => onMarkRead(notification.id)}
              >
                Marquer comme lue
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

interface NotificationsPanelProps {
  emptyMessage?: string
}

export function NotificationsPanel({
  emptyMessage = 'Aucune notification pour le moment.',
}: NotificationsPanelProps) {
  const { data: notifications = [], isLoading } = useGetMyNotificationsQuery(undefined, {
    pollingInterval: 60_000,
  })
  const { data: unread } = useGetUnreadNotificationCountQuery(undefined, {
    pollingInterval: 60_000,
  })
  const [markAsRead, { isLoading: markingOne }] = useMarkNotificationAsReadMutation()
  const [markAllAsRead, { isLoading: markingAll }] = useMarkAllNotificationsAsReadMutation()

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-w-0 w-full space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          {unread?.count ? (
            <>
              <span className="font-semibold text-slate-900">{unread.count}</span>{' '}
              notification{unread.count > 1 ? 's' : ''} non lue{unread.count > 1 ? 's' : ''}
            </>
          ) : (
            'Toutes vos notifications sont lues.'
          )}
        </p>
        {(unread?.count ?? 0) > 0 && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={markingAll}
            onClick={() => markAllAsRead()}
          >
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
          <p className="text-sm text-slate-600">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={(id) => markAsRead(id)}
              isMarking={markingOne}
            />
          ))}
        </div>
      )}
    </div>
  )
}
