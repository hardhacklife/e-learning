import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.email('Adresse e-mail invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20'

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
    <div className="w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="votre@email.sn"
            className={cn(inputClass, errors.email && 'border-red-400')}
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className={cn(inputClass, errors.password && 'border-red-400')}
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {errors.root && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            {errors.root.message}
          </p>
        )}

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Se connecter
        </Button>
      </form>
    </div>
  )
}
