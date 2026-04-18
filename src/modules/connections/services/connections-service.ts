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

  async getAll(): Promise<Connection[]> {
    return apiClient.get<Connection[]>(`${this.basePath}/`)
  }

  async getById(connectedAccountId: string): Promise<Connection> {
    return apiClient.get<Connection>(`${this.basePath}/${connectedAccountId}`)
  }

  async delete(connectedAccountId: string): Promise<void> {
    return apiClient.delete(`${this.basePath}/${connectedAccountId}`)
  }

  async initiateOAuth(data: InitiateOAuthRequest): Promise<OAuthInitiateResponse> {
    return apiClient.post<OAuthInitiateResponse>(`${this.basePath}/initiate`, data)
  }
}

export const connectionsService = new ConnectionsService()
