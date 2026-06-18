import { PageHeader } from '@/components/layout/PageHeader'
import { DashboardLoader } from '@/components/dashboard/DashboardLoader'
import { StatCard } from '@/components/dashboard/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useGetCareerStatsQuery } from '@/features/dashboard/api/dashboardApi'

export function CareerDashboardPage() {
  const { data, isLoading } = useGetCareerStatsQuery()

  if (isLoading) return <DashboardLoader />

  const totalEmployed = (data?.employed ?? 0) + (data?.selfEmployed ?? 0)
  const salariedPercent = totalEmployed
    ? Math.round(((data?.employed ?? 0) / totalEmployed) * 100)
    : 0

  return (
    <div>
      <PageHeader
        title="Insertion professionnelle"
        description="Stages, partenaires et statistiques d'emploi"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Stages en cours" value={data?.internships ?? 0} variant="rose" />
        <StatCard label="Partenaires" value={data?.partners ?? 0} variant="primary" />
        <StatCard label="Emploi salarié" value={data?.employed ?? 0} variant="emerald" />
        <StatCard label="Auto-emploi" value={data?.selfEmployed ?? 0} variant="amber" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Répartition de l'insertion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-600">Emploi salarié</span>
                  <span className="font-medium text-emerald-700">{salariedPercent} %</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${salariedPercent}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-600">Auto-emploi</span>
                  <span className="font-medium text-amber-700">
                    {100 - salariedPercent} %
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{ width: `${100 - salariedPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-rose-200 bg-rose-50/30">
          <CardHeader>
            <CardTitle className="text-rose-800">Alertes insertion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>8 conventions de stage à renouveler</p>
            <p>3 bilans de stage en attente de validation</p>
            <p>2 nouveaux partenaires entreprises ce mois</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
