import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { cn, formatFullName, getInitials } from '@/lib/utils'

interface ProfileDropdownProps {
  roleLabel: string
}

export function ProfileDropdown({ roleLabel }: ProfileDropdownProps) {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  if (!user) return null

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Menu du profil"
        className={cn(
          'flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors',
          open ? 'bg-slate-100' : 'hover:bg-slate-50',
        )}
      >
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900">
            {formatFullName(user.firstName, user.lastName)}
          </p>
          <p className="text-xs text-slate-500">{roleLabel}</p>
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
          {getInitials(user.firstName, user.lastName)}
        </div>

        <svg
          className={cn(
            'h-4 w-4 text-slate-400 transition-transform',
            open && 'rotate-180',
          )}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
        >
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-medium text-slate-900">
              {formatFullName(user.firstName, user.lastName)}
            </p>
            <p className="mt-0.5 truncate text-xs text-slate-500">{user.email}</p>
            <p className="mt-1 text-xs text-slate-400">{roleLabel}</p>
          </div>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              void logout()
            }}
            className="flex w-full px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            Déconnexion
          </button>
        </div>
      )}
    </div>
  )
}
