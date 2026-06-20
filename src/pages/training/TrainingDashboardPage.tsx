import { PageHeader } from '@/components/layout/PageHeader'
import { DashboardLoader } from '@/components/dashboard/DashboardLoader'
import { StatCard } from '@/components/dashboard/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useGetTrainingStatsQuery } from '@/features/dashboard/api/dashboardApi'

function formatFormateurs(noms?: string[]) {
  if (!noms?.length) return '—'
  if (noms.length <= 2) return noms.join(', ')
  return `${noms.slice(0, 2).join(', ')} +${noms.length - 2}`
}

export function TrainingDashboardPage() {
  const { data: stats, isLoading, isError, refetch } = useGetTrainingStatsQuery()

  if (isLoading) return <DashboardLoader />

  if (isError || !stats) {
    return (
      <div>
        <PageHeader
          title="Gestion académique"
          description="Formations, emplois du temps et formateurs"
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

  const formations = stats.formationSummaries ?? []

  return (
    <div>
      <PageHeader
        title="Gestion académique"
        description="Formations, emplois du temps et formateurs"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Formations" value={stats.formations} variant="primary" />
        <StatCard label="Emplois du temps" value={stats.schedules} variant="amber" />
        <StatCard label="Formateurs" value={stats.trainers} variant="violet" />
        <StatCard label="Étudiants" value={stats.students} variant="emerald" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <StatCard label="Filières" value={stats.filieres} />
        <StatCard label="Promotions" value={stats.promotions} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Formations en cours</CardTitle>
        </CardHeader>
        <CardContent>
          {formations.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune formation enregistrée.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-slate-500">
                    <th className="pb-3 font-medium">Intitulé</th>
                    <th className="pb-3 font-medium">Filière</th>
                    <th className="pb-3 font-medium">Niveau</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Formateurs</th>
                    <th className="pb-3 font-medium text-right">Effectif</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {formations.map((formation) => (
                    <tr key={formation.id}>
                      <td className="py-3 font-medium text-slate-900">
                        {formation.titre}
                      </td>
                      <td className="py-3 text-slate-600">
                        {formation.filiereNom ?? '—'}
                      </td>
                      <td className="py-3 text-slate-600">
                        {formation.niveau ?? '—'}
                      </td>
                      <td className="py-3 text-slate-600">
                        {formation.typeFormation ?? '—'}
                      </td>
                      <td className="py-3 text-slate-600">
                        {formatFormateurs(formation.formateurNoms)}
                      </td>
                      <td className="py-3 text-right text-slate-600">
                        {formation.effectif}
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
