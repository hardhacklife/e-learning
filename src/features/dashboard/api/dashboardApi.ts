import { baseApi } from '@/app/api/baseApi'
import type {
  AdminDashboardStats,
  CareerDashboardStats,
  StaffDashboardStats,
  TrainerDashboardStats,
  TrainingDashboardStats,
  TutorDashboardStats,
} from '@/types/dashboard'

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query<AdminDashboardStats, void>({
      query: () => '/dashboard/admin',
      providesTags: ['Dashboard'],
    }),
    getTrainerStats: builder.query<TrainerDashboardStats, void>({
      query: () => '/dashboard/trainer',
      providesTags: ['Dashboard'],
    }),
    getStaffStats: builder.query<StaffDashboardStats, void>({
      query: () => '/dashboard/staff',
      providesTags: ['Dashboard'],
    }),
    getTrainingStats: builder.query<TrainingDashboardStats, void>({
      query: () => '/dashboard/training',
      providesTags: ['Dashboard'],
    }),
    getCareerStats: builder.query<CareerDashboardStats, void>({
      query: () => '/dashboard/career',
      providesTags: ['Dashboard'],
    }),
    getTutorStats: builder.query<TutorDashboardStats, void>({
      query: () => '/dashboard/tutor',
      providesTags: ['Dashboard'],
    }),
  }),
})

export const {
  useGetAdminStatsQuery,
  useGetTrainerStatsQuery,
  useGetStaffStatsQuery,
  useGetTrainingStatsQuery,
  useGetCareerStatsQuery,
  useGetTutorStatsQuery,
} = dashboardApi
