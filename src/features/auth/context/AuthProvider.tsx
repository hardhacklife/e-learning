import { useCallback, useEffect, useMemo, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { baseApi } from '@/app/api/baseApi'
import {
  useGetMeQuery,
  useLoginMutation,
  useLogoutMutation,
} from '@/features/auth/api/authApi'
import {
  AuthContext,
  type AuthContextValue,
} from '@/features/auth/context/authContext'
import {
  logout as logoutAction,
  setCredentials,
  setUser,
} from '@/features/auth/slice/authSlice'
import type { LoginCredentials } from '@/types/auth'
import { ROLE_HOME_PATH } from '@/types/roles'
import type { UserRole } from '@/types/roles'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated, token } = useAppSelector((state) => state.auth)

  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation()
  const [logoutMutation] = useLogoutMutation()

  const {
    data: meData,
    isLoading: isMeLoading,
    isFetching: isMeFetching,
    isError: isMeError,
  } = useGetMeQuery(undefined, { skip: !token })

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const response = await loginMutation(credentials).unwrap()
      dispatch(setCredentials(response))

      const primaryRole = response.user.roles[0]
      const homePath = primaryRole ? ROLE_HOME_PATH[primaryRole] : '/student'
      navigate(homePath, { replace: true })
    },
    [dispatch, loginMutation, navigate],
  )

  const logout = useCallback(async () => {
    try {
      await logoutMutation().unwrap()
    } catch {
      // Déconnexion locale même si l'API échoue
    } finally {
      dispatch(logoutAction())
      dispatch(baseApi.util.resetApiState())
      navigate('/auth/login', { replace: true })
    }
  }, [dispatch, logoutMutation, navigate])

  const hasRole = useCallback(
    (role: UserRole) => user?.roles.includes(role) ?? false,
    [user],
  )

  const hasAnyRole = useCallback(
    (roles: UserRole[]) => roles.some((role) => hasRole(role)),
    [hasRole],
  )

  const getHomePath = useCallback(() => {
    const primaryRole = user?.roles[0]
    return primaryRole ? ROLE_HOME_PATH[primaryRole] : '/auth/login'
  }, [user])

  useEffect(() => {
    if (!token && isAuthenticated) {
      dispatch(logoutAction())
    }
  }, [dispatch, isAuthenticated, token])

  useEffect(() => {
    if (meData) {
      dispatch(setUser(meData))
    }
  }, [dispatch, meData])

  useEffect(() => {
    if (isMeError && token) {
      dispatch(logoutAction())
      navigate('/auth/login', { replace: true })
    }
  }, [dispatch, isMeError, navigate, token])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: isAuthenticated && !!token,
      isLoading: isLoginLoading || isMeLoading || isMeFetching,
      login,
      logout,
      hasRole,
      hasAnyRole,
      getHomePath,
    }),
    [
      user,
      isAuthenticated,
      token,
      isLoginLoading,
      isMeLoading,
      isMeFetching,
      login,
      logout,
      hasRole,
      hasAnyRole,
      getHomePath,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
