import type { BaseQueryApi } from '@reduxjs/toolkit/query'
import type { AuthResponse, LoginCredentials } from '@/types/auth'
import type { RootState } from '@/app/store'
import {
  findMockUserByEmail,
  findMockUserById,
  toPublicUser,
} from '@/mocks/data/users'
import {
  createMockToken,
  fakeDelay,
  getUserIdFromMockToken,
} from '@/mocks/utils'

export async function handleAuthLogin(body: unknown) {
  await fakeDelay()

  const { email, password } = body as LoginCredentials
  const account = findMockUserByEmail(email)

  if (!account || account.password !== password) {
    return {
      error: { status: 401, data: 'Identifiants incorrects' },
    }
  }

  const response: AuthResponse = {
    token: createMockToken(account.id),
    refreshToken: `refresh.${account.id}`,
    user: toPublicUser(account),
  }

  return { data: response }
}

export async function handleAuthMe(api: BaseQueryApi) {
  await fakeDelay(200)

  const state = api.getState() as RootState
  const userId = getUserIdFromMockToken(state.auth.token)
  const account = userId ? findMockUserById(userId) : undefined

  if (!account) {
    return { error: { status: 401, data: 'Session expirée' } }
  }

  return { data: toPublicUser(account) }
}

export async function handleAuthLogout() {
  await fakeDelay(150)
  return { data: null }
}
