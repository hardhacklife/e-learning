export function fakeDelay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function parseRequest(args: string | { url: string; method?: string; body?: unknown }) {
  const url = typeof args === 'string' ? args : args.url
  const method = (typeof args === 'string' ? 'GET' : args.method ?? 'GET').toUpperCase()
  const body = typeof args === 'object' ? args.body : undefined
  const path = url.replace(/^\//, '')

  return { path, method, body, url }
}

export function createMockToken(userId: string) {
  return `mock.${userId}.${Date.now()}`
}

export function getUserIdFromMockToken(token: string | null) {
  if (!token) return null
  const match = /^mock\.([^.]+)\./.exec(token)
  return match?.[1] ?? null
}
