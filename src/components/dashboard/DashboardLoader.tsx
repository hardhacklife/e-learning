import { Spinner } from '@/components/ui/Spinner'

export function DashboardLoader() {
  return (
    <div className="flex justify-center py-16">
      <Spinner size="lg" />
    </div>
  )
}
