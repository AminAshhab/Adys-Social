import type { IUserRepository } from '@/features/users/ports/IUserRepository'
import type { IHttpService } from '@/infrastructure/ports/IHttpService'
import type { User } from '@/features/users/domain/User'
import { createUser } from '@/features/users/domain/User'
import type { ID } from '@/shared/types'

// LSP: fully substitutable for IUserRepository
// DIP: depends on IHttpService abstraction, not fetch directly
export class UserRepository implements IUserRepository {
  constructor(private readonly http: IHttpService) {}

  async getAll(): Promise<User[]> {
    const raw = await this.http.get<unknown[]>('/users')
    return raw.map((r) => createUser(r as Parameters<typeof createUser>[0]))
  }

  async getById(id: ID): Promise<User | null> {
    try {
      const raw = await this.http.get<Parameters<typeof createUser>[0]>(`/users/${id}`)
      return createUser(raw)
    } catch {
      return null
    }
  }

  async save(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const raw = await this.http.post<Parameters<typeof createUser>[0]>('/users', data)
    return createUser(raw)
  }

  async delete(id: ID): Promise<void> {
    await this.http.delete(`/users/${id}`)
  }
}
