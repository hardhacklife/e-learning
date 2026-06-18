import type { UserRole } from '@/types/roles'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  roles: UserRole[]
  avatarUrl?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  refreshToken?: string
  user: User
}

export interface AuthState {
  token: string | null
  refreshToken: string | null
  user: User | null
  isAuthenticated: boolean
}
