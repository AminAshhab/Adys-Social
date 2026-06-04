import { FetchHttpService } from '@/infrastructure/http/FetchHttpService'
import { UserRepository } from '@/features/users/infrastructure/UserRepository'
import { GetUsersUseCase } from '@/features/users/usecases/GetUsersUseCase'

// DIP: wire concretions once here; features depend only on abstractions
const http = new FetchHttpService()

export const container = {
  getUsersUseCase: new GetUsersUseCase(new UserRepository(http)),
}
