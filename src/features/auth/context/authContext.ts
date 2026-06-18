import { createContext } from 'react'
import type { LoginCredentials, User } from '@/types/auth'
import type { UserRole } from '@/types/roles'

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
  getHomePath: () => string
}

export const AuthContext = createContext<AuthContextValue | null>(null)
