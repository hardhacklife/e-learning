import { PageHeader } from '@/components/layout/PageHeader'
import { DashboardLoader } from '@/components/dashboard/DashboardLoader'
import { StatCard } from '@/components/dashboard/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useGetAdminStatsQuery } from '@/features/dashboard/api/dashboardApi'

const SYSTEM_ALERTS = [
  '12 comptes en attente de validation',
  'Sauvegarde système effectuée ce matin',
  '3 rôles modifiés cette semaine',
]

export function AdminDashboardPage() {
  const { data, isLoading } = useGetAdminStatsQuery()

  if (isLoading) return <DashboardLoader />

  return (
    <div>
      <PageHeader
        title="Administration système"
        description="Supervision globale de la plateforme UCHK"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Utilisateurs" value={data?.users ?? 0} variant="primary" />
        <StatCard label="Étudiants inscrits" value={data?.students ?? 0} variant="emerald" />
        <StatCard label="Formations actives" value={data?.formations ?? 0} variant="violet" />
        <StatCard label="Documents archivés" value={data?.documents ?? 0} variant="amber" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {SYSTEM_ALERTS.map((alert) => (
                <li
                  key={alert}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                  {alert}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardHeader>
            <CardTitle className="text-white">État du système</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300">
            <div className="flex justify-between">
              <span>Disponibilité</span>
              <span className="font-medium text-emerald-400">99,2 %</span>
            </div>
            <div className="flex justify-between">
              <span>Utilisateurs connectés</span>
              <span className="font-medium text-white">24</span>
            </div>
            <div className="flex justify-between">
              <span>Dernière synchronisation</span>
              <span className="font-medium text-white">Il y a 5 min</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
