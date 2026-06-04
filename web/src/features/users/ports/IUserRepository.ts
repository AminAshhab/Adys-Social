import type { User } from '@/features/users/domain/User'
import type { ID } from '@/shared/types'

// ISP: keep interfaces narrow — split further if callers only need reads or writes
export interface IUserRepository {
  getAll(): Promise<User[]>
  getById(id: ID): Promise<User | null>
  save(data: Omit<User, 'id' | 'createdAt'>): Promise<User>
  delete(id: ID): Promise<void>
}
