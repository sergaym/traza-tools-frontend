import { apiClient } from "@/lib/api-client"
import type { CursorPaginated } from "@/lib/types"
import type { Account, CreateAccountRequest } from "@/modules/accounts/types"

class AccountsService {
  private readonly basePath = "/v1/users"

  async getAll(params?: { limit?: number; starting_after?: string }): Promise<CursorPaginated<Account>> {
    return apiClient.get<CursorPaginated<Account>>(`${this.basePath}/`, params)
  }

  async create(data: CreateAccountRequest): Promise<Account> {
    return apiClient.post<Account>(`${this.basePath}/`, data)
  }

  async getById(accountId: string): Promise<Account> {
    return apiClient.get<Account>(`${this.basePath}/${accountId}`)
  }

  async delete(accountId: string): Promise<void> {
    return apiClient.delete(`${this.basePath}/${accountId}`)
  }
}

export const accountsService = new AccountsService()
