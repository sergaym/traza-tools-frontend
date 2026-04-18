import { apiClient } from "@/lib/api-client"
import type { ConnectLink, CreateConnectLinkRequest } from "@/modules/connect-links/types"

class ConnectLinksService {
  private readonly basePath = "/v1/connect-links"

  async create(data: CreateConnectLinkRequest): Promise<ConnectLink> {
    return apiClient.post<ConnectLink>(`${this.basePath}/`, data)
  }
}

export const connectLinksService = new ConnectLinksService()
