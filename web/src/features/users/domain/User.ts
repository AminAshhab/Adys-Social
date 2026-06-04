import type { ID } from '@/shared/types'

export interface User {
  id: ID
  name: string
  email: string
  createdAt: Date
}

export function createUser(raw: { id: string; name: string; email: string; createdAt: string }): User {
  return { ...raw, createdAt: new Date(raw.createdAt) }
}
