import { apiClient } from "@/lib/api-client"
import type { User, CreateUserRequest } from "@/modules/users/types"

class UsersService {
  private readonly basePath = "/v1/users"

  async create(data: CreateUserRequest): Promise<User> {
    return apiClient.post<User>(`${this.basePath}/`, data)
  }

  async getById(userId: string): Promise<User> {
    return apiClient.get<User>(`${this.basePath}/${userId}`)
  }
}

export const usersService = new UsersService()
