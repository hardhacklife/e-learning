import { PageHeader } from '@/components/layout/PageHeader'
import { DashboardLoader } from '@/components/dashboard/DashboardLoader'
import { StatCard } from '@/components/dashboard/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useGetAdminStatsQuery } from '@/features/dashboard/api/dashboardApi'

export function AdminDashboardPage() {
  const { data, isLoading, isError, refetch } = useGetAdminStatsQuery()

  if (isLoading) return <DashboardLoader />

  if (isError || !data) {
    return (
      <div>
        <PageHeader
          title="Administration système"
          description="Supervision globale de la plateforme UCHK"
        />
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-6 text-center">
          <p className="text-sm font-medium text-rose-800">
            Impossible de charger les statistiques.
          </p>
          <p className="mt-1 text-xs text-rose-600">
            Vérifiez que le backend est démarré avec la dernière version, puis
            réessayez.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  const overviewItems = [
    `${data.formations} formation(s) enregistrée(s)`,
    `${data.trainers} formateur(s) actif(s)`,
    `${data.promotions} promotion(s) ouverte(s)`,
    `${data.filieres} filière(s) configurée(s)`,
  ]

  return (
    <div>
      <PageHeader
        title="Administration système"
        description="Supervision globale de la plateforme UCHK"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Utilisateurs" value={data.users} variant="primary" />
        <StatCard label="Étudiants inscrits" value={data.students} variant="emerald" />
        <StatCard label="Formations" value={data.formations} variant="violet" />
        <StatCard label="Formateurs" value={data.trainers} variant="amber" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vue d'ensemble académique</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {overviewItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900 text-white">
          <CardHeader>
            <CardTitle className="text-white">Ressources humaines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300">
            <div className="flex justify-between">
              <span>Personnel administratif</span>
              <span className="font-medium text-white">{data.personnel}</span>
            </div>
            <div className="flex justify-between">
              <span>Formateurs</span>
              <span className="font-medium text-emerald-400">{data.trainers}</span>
            </div>
            <div className="flex justify-between">
              <span>Filières</span>
              <span className="font-medium text-white">{data.filieres}</span>
            </div>
            <div className="flex justify-between">
              <span>Promotions</span>
              <span className="font-medium text-white">{data.promotions}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
