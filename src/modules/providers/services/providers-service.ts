import { apiClient } from "@/lib/api-client"
import type { CursorPaginated } from "@/lib/types"
import type { ProviderSummary, ProviderDetail } from "@/modules/providers/types"

class ProvidersService {
  private readonly basePath = "/v1/providers"

  async getAll(params?: { limit?: number; starting_after?: string }): Promise<CursorPaginated<ProviderSummary>> {
    return apiClient.get<CursorPaginated<ProviderSummary>>(`${this.basePath}/`, params)
  }

  async getById(providerId: string): Promise<ProviderDetail> {
    return apiClient.get<ProviderDetail>(`${this.basePath}/${providerId}`)
  }
}

export const providersService = new ProvidersService()
