import { useMemo } from 'react'
import { Spinner } from '@/components/ui/Spinner'
import { WeeklySchedule } from '@/features/schedule/components/WeeklySchedule'
import { useGetMySeancesQuery } from '@/features/schedule/api/scheduleApi'
import { mapSeanceToScheduleEvent } from '@/features/schedule/utils/scheduleMappers'

const useMock = import.meta.env.VITE_USE_MOCK !== 'false'

export function TrainerSchedulePage() {
  const { data: seances = [], isLoading, isError } = useGetMySeancesQuery(undefined, {
    skip: useMock,
  })

  const events = useMemo(() => seances.map(mapSeanceToScheduleEvent), [seances])

  return (
    <div className="min-w-0 w-full">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-900">Emploi du temps</h1>
        <p className="mt-1 text-sm text-slate-500">
          Vos séances et créneaux de cours
        </p>
      </div>
      {!useMock && isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}
      {!useMock && isError && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          Impossible de charger votre emploi du temps.
        </p>
      )}
      {(useMock || !isLoading) && (
        <WeeklySchedule
          compact
          events={useMock ? undefined : events}
          statsLabel={
            !useMock
              ? `${seances.length} séance${seances.length !== 1 ? 's' : ''}`
              : undefined
          }
          emptyMessage="Aucune séance planifiée pour vous."
        />
      )}
    </div>
  )
}
