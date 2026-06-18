import { baseApi } from '@/app/api/baseApi'
import type { BackendAuthResponse } from '@/features/auth/utils/authMappers'
import { CATEGORY_API_PATH } from '@/features/admin/config/personnelCategories'
import {
  mapMembreToAdminPersonnel,
  toAdminPersonnelFromAuthResponse,
  toCreateUserRequest,
  toUpdateUserRequest,
  type BackendCreateUserRequest,
  type BackendMembreResponse,
} from '@/features/admin/utils/personnelMappers'
import type {
  AdminPersonnel,
  PersonnelCategory,
} from '@/mocks/data/adminPersonnel'

export interface CreatePersonnelInput {
  values: AdminPersonnel
  password: string
}

export interface UpdatePersonnelInput {
  values: AdminPersonnel
  password?: string
}

export interface DeletePersonnelInput {
  id: string
  category: PersonnelCategory
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategoryMembers: builder.query<AdminPersonnel[], PersonnelCategory>({
      query: (category) => CATEGORY_API_PATH[category],
      transformResponse: (response: BackendMembreResponse[]) =>
        response.map(mapMembreToAdminPersonnel),
      providesTags: (_result, _error, category) => [
        { type: 'AdminPersonnel', id: category },
      ],
    }),
    createMember: builder.mutation<AdminPersonnel, CreatePersonnelInput>({
      query: ({ values, password }) => ({
        url: '/auth/create-user',
        method: 'POST',
        body: toCreateUserRequest(values, password) satisfies BackendCreateUserRequest,
      }),
      transformResponse: (response: BackendAuthResponse, _meta, arg) =>
        toAdminPersonnelFromAuthResponse(response, arg.values),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'AdminPersonnel', id: arg.values.category },
      ],
    }),
    updateMember: builder.mutation<AdminPersonnel, UpdatePersonnelInput>({
      query: ({ values, password }) => ({
        url: `/auth/users/${values.id}`,
        method: 'PUT',
        body: toUpdateUserRequest(values, password),
      }),
      transformResponse: (response: BackendMembreResponse) =>
        mapMembreToAdminPersonnel(response),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'AdminPersonnel', id: arg.values.category },
      ],
    }),
    deleteMember: builder.mutation<void, DeletePersonnelInput>({
      query: ({ id }) => ({
        url: `/auth/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'AdminPersonnel', id: arg.category },
      ],
    }),
  }),
})

export const {
  useGetCategoryMembersQuery,
  useCreateMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
} = adminApi
