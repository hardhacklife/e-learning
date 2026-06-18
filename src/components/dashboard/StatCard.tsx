import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

type StatVariant = 'default' | 'primary' | 'emerald' | 'amber' | 'violet' | 'rose'

interface StatCardProps {
  label: string
  value: string | number
  variant?: StatVariant
  description?: string
}

const variantClasses: Record<StatVariant, string> = {
  default: 'border-slate-200',
  primary: 'border-primary-200 bg-primary-50/50',
  emerald: 'border-emerald-200 bg-emerald-50/50',
  amber: 'border-amber-200 bg-amber-50/50',
  violet: 'border-violet-200 bg-violet-50/50',
  rose: 'border-rose-200 bg-rose-50/50',
}

const valueClasses: Record<StatVariant, string> = {
  default: 'text-slate-900',
  primary: 'text-primary-700',
  emerald: 'text-emerald-700',
  amber: 'text-amber-700',
  violet: 'text-violet-700',
  rose: 'text-rose-700',
}

export function StatCard({
  label,
  value,
  variant = 'default',
  description,
}: StatCardProps) {
  return (
    <Card className={cn(variantClasses[variant])}>
      <CardContent className="pt-5">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className={cn('mt-2 text-3xl font-bold', valueClasses[variant])}>
          {value}
        </p>
        {description && (
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
