import { LoginForm } from '@/features/auth/components/LoginForm'
import { APP_NAME } from '@/lib/constants'

export function LoginPage() {
  return (
    <div className="flex w-full flex-col items-center">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary-600">
        UCHK
      </p>
      <h1 className="mb-1 text-xl font-bold text-slate-900">{APP_NAME}</h1>
      <p className="mb-6 text-sm text-slate-500">Connexion à votre espace</p>
      <LoginForm />
    </div>
  )
}
