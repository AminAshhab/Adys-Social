import type { IUserRepository } from '@/features/users/ports/IUserRepository'
import type { User } from '@/features/users/domain/User'

// SRP: one class, one job — orchestrate fetching users
export class GetUsersUseCase {
  constructor(private readonly repo: IUserRepository) {}

  execute(): Promise<User[]> {
    return this.repo.getAll()
  }
}
