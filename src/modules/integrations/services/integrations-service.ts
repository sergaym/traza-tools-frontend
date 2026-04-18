import { apiClient } from "@/lib/api-client"
import type { Integration, ConnectIntegrationPayload } from "@/modules/integrations/types"

class IntegrationsService {
  private readonly basePath = "/api/v1/integrations"

  async getAll(): Promise<Integration[]> {
    return apiClient.get<Integration[]>(`${this.basePath}/`)
  }

  async getById(id: string): Promise<Integration> {
    return apiClient.get<Integration>(`${this.basePath}/${id}`)
  }

  async connect(payload: ConnectIntegrationPayload): Promise<Integration> {
    return apiClient.post<Integration>(`${this.basePath}/connect`, payload)
  }

  async disconnect(id: string): Promise<void> {
    return apiClient.delete(`${this.basePath}/${id}/disconnect`)
  }

  async getConnected(): Promise<Integration[]> {
    return apiClient.get<Integration[]>(`${this.basePath}/`, { status: "connected" })
  }
}

export const integrationsService = new IntegrationsService()
