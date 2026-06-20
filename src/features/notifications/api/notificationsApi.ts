import { baseApi } from '@/app/api/baseApi'
import type {
  Notification,
  NotificationBroadcastInput,
} from '@/types/notifications'

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query<Notification[], void>({
      query: () => '/notifications',
      providesTags: ['Notification'],
    }),
    getUnreadNotificationCount: builder.query<{ count: number }, void>({
      query: () => '/notifications/unread-count',
      providesTags: ['Notification'],
    }),
    markNotificationAsRead: builder.mutation<Notification, number>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
    markAllNotificationsAsRead: builder.mutation<{ status: string }, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
    broadcastNotification: builder.mutation<
      { notifiedCount: number },
      NotificationBroadcastInput
    >({
      query: (body) => ({
        url: '/notifications/broadcast',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
})

export const {
  useGetMyNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useBroadcastNotificationMutation,
} = notificationsApi
