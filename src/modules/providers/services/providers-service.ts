import { apiClient } from "@/lib/api-client"
import type { CursorPaginated } from "@/lib/types"
import type {
  ProviderSummary,
  ProviderDetail,
  ProviderToolItem,
  ProviderConnectionItem,
} from "@/modules/providers/types"

class ProvidersService {
  private readonly basePath = "/v1/providers"

  async getAll(params?: { limit?: number; starting_after?: string }): Promise<CursorPaginated<ProviderSummary>> {
    return apiClient.get<CursorPaginated<ProviderSummary>>(`${this.basePath}/`, params)
  }

  async getById(providerId: string): Promise<ProviderDetail> {
    return apiClient.get<ProviderDetail>(`${this.basePath}/${providerId}`)
  }

  async getTools(
    providerId: string,
    params?: { limit?: number; starting_after?: string }
  ): Promise<CursorPaginated<ProviderToolItem>> {
    return apiClient.get<CursorPaginated<ProviderToolItem>>(
      `${this.basePath}/${providerId}/tools`,
      params
    )
  }

  async getTriggers(
    providerId: string,
    params?: { limit?: number; starting_after?: string }
  ): Promise<CursorPaginated<ProviderToolItem>> {
    return apiClient.get<CursorPaginated<ProviderToolItem>>(
      `${this.basePath}/${providerId}/triggers`,
      params
    )
  }

  async getConnectionDefinitions(providerId: string): Promise<ProviderConnectionItem[]> {
    return apiClient.get<ProviderConnectionItem[]>(`${this.basePath}/${providerId}/connections`)
  }
}

export const providersService = new ProvidersService()
