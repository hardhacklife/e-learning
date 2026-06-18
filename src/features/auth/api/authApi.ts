import { baseApi } from '@/app/api/baseApi'
import type { AuthResponse, LoginCredentials, User } from '@/types/auth'
import {
  mapBackendAuthResponse,
  mapBackendUser,
  type BackendAuthResponse,
  type BackendUserResponse,
} from '@/features/auth/utils/authMappers'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: {
          email: credentials.email,
          password: credentials.password,
        },
      }),
      transformResponse: (response: BackendAuthResponse) =>
        mapBackendAuthResponse(response),
      invalidatesTags: ['Auth', 'User'],
    }),
    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      transformResponse: (response: BackendUserResponse) =>
        mapBackendUser(response),
      providesTags: ['Auth', 'User'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
  }),
})

export const { useLoginMutation, useGetMeQuery, useLogoutMutation } = authApi
