import { LoginForm } from '@/features/auth/components/LoginForm'

export function LoginPage() {
  return (
    <div className="flex w-full flex-col items-center">
      <h1 className="mb-5 text-2xl font-bold tracking-tight text-slate-900">
        Connexion
      </h1>
      <LoginForm />
    </div>
  )
}
