import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.email('Adresse e-mail invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/20'

export function LoginForm() {
  const { login } = useAuth()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data)
    } catch {
      setError('root', {
        message: 'Identifiants incorrects. Veuillez réessayer.',
      })
    }
  }

  return (
    <div className="w-full rounded-2xl border border-slate-100 bg-white px-5 py-5 shadow-[0_4px_24px_rgba(15,23,42,0.06)] sm:px-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
        <div>
          <input
            type="email"
            autoComplete="email"
            placeholder="Adresse e-mail"
            className={cn(inputClass, errors.email && 'border-red-400')}
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Mot de passe"
            className={cn(inputClass, errors.password && 'border-red-400')}
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {errors.root && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            {errors.root.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-primary-400 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-500 disabled:opacity-60"
        >
          {isSubmitting ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}
