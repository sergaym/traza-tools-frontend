import { apiClient } from "@/lib/api-client"
import type {
  Connection,
  CreateConnectionRequest,
  CreateConnectionResponse,
  InitiateOAuthRequest,
  OAuthInitiateResponse,
} from "@/modules/connections/types"

class ConnectionsService {
  private readonly basePath = "/v1/connections"

  async create(data: CreateConnectionRequest): Promise<CreateConnectionResponse> {
    return apiClient.post<CreateConnectionResponse>(`${this.basePath}/`, data)
  }

  async getAll(userId: string, params?: { provider_id?: string }): Promise<Connection[]> {
    return apiClient.get<Connection[]>(`${this.basePath}/`, {
      user_id: userId,
      ...params,
    })
  }

  async getById(connectedAccountId: string, userId: string): Promise<Connection> {
    return apiClient.get<Connection>(`${this.basePath}/${connectedAccountId}`, {
      user_id: userId,
    })
  }

  async delete(connectedAccountId: string, userId: string): Promise<void> {
    return apiClient.delete(`${this.basePath}/${connectedAccountId}`, { user_id: userId })
  }

  async initiateOAuth(data: InitiateOAuthRequest): Promise<OAuthInitiateResponse> {
    return apiClient.post<OAuthInitiateResponse>(`${this.basePath}/initiate`, data)
  }
}

export const connectionsService = new ConnectionsService()
