import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import { handleAdminCreateUser } from '@/mocks/handlers/admin'
import { handleAdminMembersList } from '@/mocks/handlers/adminMembers'
import {
  handleAuthLogin,
  handleAuthLogout,
  handleAuthMe,
} from '@/mocks/handlers/auth'
import { handleDashboardStats } from '@/mocks/handlers/dashboard'
import { handleFormationsList } from '@/mocks/handlers/formations'
import {
  handleStudentById,
  handleStudentsList,
} from '@/mocks/handlers/students'
import { parseRequest } from '@/mocks/utils'

type MockBaseQueryArgs = string | { url: string; method?: string; body?: unknown }
type MockBaseQueryError = { status: number; data?: unknown }

export const mockBaseQuery: BaseQueryFn<
  MockBaseQueryArgs,
  unknown,
  MockBaseQueryError
> = async (args, api) => {
  const { path, method, body } = parseRequest(args)

  // Auth
  if (path === 'auth/login' && method === 'POST') {
    return handleAuthLogin(body)
  }
  if (path === 'auth/me' && method === 'GET') {
    return handleAuthMe(api)
  }
  if (path === 'auth/logout' && method === 'POST') {
    return handleAuthLogout()
  }
  if (path === 'auth/create-user' && method === 'POST') {
    return handleAdminCreateUser(body, api.getState)
  }

  const memberPaths = [
    'administrateurs',
    'formateurs',
    'tuteurs',
    'responsables-formation',
    'services-insertion',
    'etudiants',
  ]
  if (memberPaths.includes(path) && method === 'GET') {
    return handleAdminMembersList(path)
  }

  // Dashboard stats
  if (path.startsWith('dashboard/') && method === 'GET') {
    return handleDashboardStats(path)
  }

  // Students
  if (path === 'students' && method === 'GET') {
    return handleStudentsList()
  }
  if (path.startsWith('students/') && method === 'GET') {
    const id = path.replace('students/', '')
    return handleStudentById(id)
  }

  // Formations
  if (path === 'formations' && method === 'GET') {
    return handleFormationsList()
  }

  return {
    error: {
      status: 404,
      data: `Endpoint mock non implémenté : ${method} /${path}`,
    },
  }
}
