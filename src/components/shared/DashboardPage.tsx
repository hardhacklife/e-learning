import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/layout/PageHeader'
import { Spinner } from '@/components/ui/Spinner'

interface StatCard {
  label: string
  value: string | number
}

interface DashboardPageProps {
  title: string
  description?: string
  stats?: StatCard[]
  isLoading?: boolean
}

export function DashboardPage({
  title,
  description,
  stats,
  isLoading,
}: DashboardPageProps) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        stats &&
        stats.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  )
}
