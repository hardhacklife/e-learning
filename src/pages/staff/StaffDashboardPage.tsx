import { PageHeader } from '@/components/layout/PageHeader'
import { DashboardLoader } from '@/components/dashboard/DashboardLoader'
import { StatCard } from '@/components/dashboard/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useGetStaffStatsQuery } from '@/features/dashboard/api/dashboardApi'
import { Link } from 'react-router-dom'

const QUICK_LINKS = [
  { label: 'Courrier arrivé', path: '/staff/documents', count: 12 },
  { label: 'Notes de service', path: '/staff/documents', count: 5 },
  { label: 'Fiches personnel', path: '/staff/rh', count: 89 },
  { label: 'Projets budget', path: '/staff/budget', count: 12 },
]

export function StaffDashboardPage() {
  const { data, isLoading } = useGetStaffStatsQuery()

  if (isLoading) return <DashboardLoader />

  return (
    <div>
      <PageHeader
        title="Bureau administratif"
        description="Gestion documentaire, ressources humaines et budget"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          label="Courrier arrivé"
          value={data?.incomingMail ?? 0}
          variant="amber"
          description="En attente de traitement"
        />
        <StatCard
          label="Courrier départ"
          value={data?.outgoingMail ?? 0}
          variant="primary"
          description="Envoyés ce mois"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Accès rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 transition-colors hover:border-amber-300 hover:bg-amber-50/50"
                >
                  <span className="text-sm font-medium text-slate-700">
                    {link.label}
                  </span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                    {link.count}
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <StatCard label="Personnel" value={data?.personnel ?? 0} variant="emerald" />
          <StatCard
            label="Projets budget"
            value={data?.budgetProjects ?? 0}
            variant="violet"
          />
        </div>
      </div>
    </div>
  )
}
