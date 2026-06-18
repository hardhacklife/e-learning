import { PageHeader } from '@/components/layout/PageHeader'
import { DashboardLoader } from '@/components/dashboard/DashboardLoader'
import { StatCard } from '@/components/dashboard/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useGetTutorStatsQuery } from '@/features/dashboard/api/dashboardApi'

export function TutorDashboardPage() {
  const { data, isLoading } = useGetTutorStatsQuery()

  if (isLoading) return <DashboardLoader />

  return (
    <div>
      <PageHeader
        title="Suivi tutorat"
        description="Sessions, étudiants accompagnés et planification"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Sessions réalisées"
          value={data?.sessions ?? 0}
          variant="violet"
        />
        <StatCard
          label="Étudiants suivis"
          value={data?.students ?? 0}
          variant="emerald"
        />
        <StatCard
          label="À venir"
          value={data?.upcoming ?? 0}
          variant="amber"
          description="Sessions planifiées"
        />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Prochaines sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { student: 'Amadou Sy', topic: 'Méthodologie de recherche', date: '11 juin' },
              { student: 'Khady Mbaye', topic: 'Rédaction mémoire', date: '13 juin' },
              { student: 'Awa Diop', topic: 'Préparation soutenance', date: '18 juin' },
            ].map((session) => (
              <div
                key={session.student}
                className="flex items-center justify-between rounded-lg border border-violet-100 bg-violet-50/30 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {session.student}
                  </p>
                  <p className="text-xs text-slate-500">{session.topic}</p>
                </div>
                <span className="text-sm font-medium text-violet-700">
                  {session.date}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
