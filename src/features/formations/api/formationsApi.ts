import { baseApi } from '@/app/api/baseApi'
import type { MockFormation } from '@/mocks/data/formations'

export const formationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFormations: builder.query<MockFormation[], void>({
      query: () => '/formations',
      providesTags: ['Formation'],
    }),
  }),
})

export const { useGetFormationsQuery } = formationsApi
