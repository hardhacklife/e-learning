import { PageHeader } from '@/components/layout/PageHeader'
import { DashboardLoader } from '@/components/dashboard/DashboardLoader'
import { StatCard } from '@/components/dashboard/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useGetTrainingStatsQuery } from '@/features/dashboard/api/dashboardApi'
import { useGetFormationsQuery } from '@/features/formations/api/formationsApi'

export function TrainingDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useGetTrainingStatsQuery()
  const { data: formations, isLoading: formationsLoading } = useGetFormationsQuery()

  if (statsLoading) return <DashboardLoader />

  return (
    <div>
      <PageHeader
        title="Gestion académique"
        description="Formations, emplois du temps et formateurs"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Formations" value={stats?.formations ?? 0} variant="primary" />
        <StatCard label="Emplois du temps" value={stats?.schedules ?? 0} variant="amber" />
        <StatCard label="Formateurs" value={stats?.trainers ?? 0} variant="violet" />
        <StatCard label="Étudiants" value={stats?.students ?? 0} variant="emerald" />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Formations en cours</CardTitle>
        </CardHeader>
        <CardContent>
          {formationsLoading ? (
            <DashboardLoader />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-slate-500">
                    <th className="pb-3 font-medium">Intitulé</th>
                    <th className="pb-3 font-medium">Niveau</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Effectif</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {formations?.map((f) => (
                    <tr key={f.id}>
                      <td className="py-3 font-medium text-slate-900">{f.title}</td>
                      <td className="py-3 text-slate-600">{f.level}</td>
                      <td className="py-3 text-slate-600">{f.type}</td>
                      <td className="py-3 text-slate-600">
                        {f.maleCount + f.femaleCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
