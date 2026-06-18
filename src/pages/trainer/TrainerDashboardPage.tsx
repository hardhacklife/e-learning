import { PageHeader } from '@/components/layout/PageHeader'
import { DashboardLoader } from '@/components/dashboard/DashboardLoader'
import { StatCard } from '@/components/dashboard/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useGetTrainerStatsQuery } from '@/features/dashboard/api/dashboardApi'

const UPCOMING_MEETINGS = [
  { title: 'Préparation évaluation — Dev Web', date: '12 juin, 10h00' },
  { title: 'Réunion pédagogique — L2 Info', date: '14 juin, 14h30' },
  { title: 'Suivi tutorat — Groupe A', date: '17 juin, 09h00' },
]

export function TrainerDashboardPage() {
  const { data, isLoading } = useGetTrainerStatsQuery()

  if (isLoading) return <DashboardLoader />

  return (
    <div>
      <PageHeader
        title="Espace enseignant"
        description="Vos cours, réunions et activités pédagogiques"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Cours actifs"
          value={data?.activeCourses ?? 0}
          variant="primary"
        />
        <StatCard
          label="Réunions planifiées"
          value={data?.meetings ?? 0}
          variant="violet"
        />
        <StatCard
          label="Étudiants"
          value={data?.students ?? 0}
          variant="emerald"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Prochaines réunions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-slate-100">
              {UPCOMING_MEETINGS.map((meeting) => (
                <li key={meeting.title} className="flex justify-between py-3 text-sm">
                  <span className="font-medium text-slate-800">{meeting.title}</span>
                  <span className="text-slate-500">{meeting.date}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-primary-200 bg-gradient-to-br from-primary-50 to-white lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-primary-800">Cours en cours</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            <p className="font-medium text-slate-900">Développement Web Full Stack</p>
            <p className="mt-1">50 étudiants — Licence 3</p>
            <p className="mt-4 text-xs text-primary-600">
              Prochaine séance : Mercredi 14h00
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
