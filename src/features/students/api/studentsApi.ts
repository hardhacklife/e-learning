import { baseApi } from '@/app/api/baseApi'
import type { BackendMembreResponse } from '@/features/admin/utils/personnelMappers'
import type { FiliereModuleSummary } from '@/features/catalog/api/catalogApi'
import type { MockStudent } from '@/mocks/data/students'

export interface StudentCreateInput {
  email: string
  motDePasse: string
  nom: string
  prenom: string
  telephone?: string
  ine: string
  dateNaissance?: string
  anneeEntree?: number
  filiereId: number
  promotionId?: number
  groupeEtudiantId?: number
}

export interface FormateurModuleOption {
  id: number
  titre: string
  slug?: string
  filiereId?: number
  filiereNom?: string
}

export interface EtudiantFiliereView {
  id: number
  nom: string
  description?: string
  modules: FiliereModuleSummary[]
}

export const studentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<BackendMembreResponse[], { moduleId?: number } | void>({
      query: (params) => {
        const moduleId =
          params && typeof params === 'object' ? params.moduleId : undefined
        if (moduleId != null) {
          return `/etudiants?moduleId=${moduleId}`
        }
        return '/etudiants'
      },
      providesTags: ['Student'],
    }),
    createStudent: builder.mutation<BackendMembreResponse, StudentCreateInput>({
      query: (body) => ({ url: '/etudiants', method: 'POST', body }),
      invalidatesTags: ['Student', 'Filiere'],
    }),
    getMyModules: builder.query<FormateurModuleOption[], void>({
      query: () => '/formateurs/me/modules',
      providesTags: ['Formateur'],
    }),
    getMyFiliere: builder.query<EtudiantFiliereView, void>({
      query: () => '/etudiants/me/filiere',
      providesTags: ['Student', 'Filiere'],
    }),
    getStudent: builder.query<MockStudent, string>({
      query: (id) => `/students/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Student', id }],
    }),
  }),
})

export const {
  useGetStudentsQuery,
  useCreateStudentMutation,
  useGetMyModulesQuery,
  useGetMyFiliereQuery,
  useGetStudentQuery,
} = studentsApi

/** @deprecated Utiliser useGetMyModulesQuery */
export const useGetMyFormationsQuery = useGetMyModulesQuery
