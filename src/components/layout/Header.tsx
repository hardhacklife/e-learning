import { useAuth } from '@/features/auth/hooks/useAuth'
import { formatFullName, getInitials } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ROLE_LABELS } from '@/types/roles'

interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth()

  if (!user) return null

  const primaryRole = user.roles[0]

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        {title && <h1 className="text-lg font-semibold text-slate-900">{title}</h1>}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-900">
            {formatFullName(user.firstName, user.lastName)}
          </p>
          {primaryRole && (
            <p className="text-xs text-slate-500">{ROLE_LABELS[primaryRole]}</p>
          )}
        </div>

        <div
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700"
          aria-hidden
        >
          {getInitials(user.firstName, user.lastName)}
        </div>

        <Button variant="outline" size="sm" onClick={() => void logout()}>
          Déconnexion
        </Button>
      </div>
    </header>
  )
}
