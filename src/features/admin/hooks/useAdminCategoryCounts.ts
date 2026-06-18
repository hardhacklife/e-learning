import { useGetCategoryMembersQuery } from '@/features/admin/api/adminApi'
import { PERSONNEL_CATEGORIES } from '@/features/admin/config/personnelCategories'
import type { PersonnelCategory } from '@/mocks/data/adminPersonnel'

const useMock = import.meta.env.VITE_USE_MOCK !== 'false'

export function useAdminCategoryCounts(
  mockCounts: Record<PersonnelCategory, number>,
) {
  const administratif = useGetCategoryMembersQuery('administratif', { skip: useMock })
  const formation = useGetCategoryMembersQuery('formation', { skip: useMock })
  const enseignant = useGetCategoryMembersQuery('enseignant', { skip: useMock })
  const tuteur = useGetCategoryMembersQuery('tuteur', { skip: useMock })
  const etudiant = useGetCategoryMembersQuery('etudiant', { skip: useMock })
  const insertion = useGetCategoryMembersQuery('insertion', { skip: useMock })

  if (useMock) {
    return { counts: mockCounts, isLoading: false }
  }

  const queries = [
    administratif,
    formation,
    enseignant,
    tuteur,
    etudiant,
    insertion,
  ]

  const counts = Object.fromEntries(
    PERSONNEL_CATEGORIES.map((cat, index) => [
      cat.id,
      queries[index]?.data?.length ?? 0,
    ]),
  ) as Record<PersonnelCategory, number>

  return {
    counts,
    isLoading: queries.some((q) => q.isLoading),
  }
}
