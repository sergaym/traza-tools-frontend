import { apiClient } from "@/lib/api-client"
import type {
  ApiKeySummary,
  CreateApiKeyResponse,
  CreateOrganizationResponse,
  OrganizationSummary,
} from "@/modules/organizations/types"

class OrganizationsService {
  private readonly basePath = "/v1/organizations"

  async signup(body: {
    org_name: string
    name: string
    email: string
    password: string
  }): Promise<CreateOrganizationResponse> {
    return apiClient.post<CreateOrganizationResponse>(`${this.basePath}/signup`, body)
  }

  async create(name: string): Promise<CreateOrganizationResponse> {
    return apiClient.post<CreateOrganizationResponse>(`${this.basePath}/`, { name })
  }

  async updateName(name: string): Promise<OrganizationSummary> {
    return apiClient.patch<OrganizationSummary>(`${this.basePath}/`, { name })
  }

  async listApiKeys(): Promise<ApiKeySummary[]> {
    return apiClient.get<ApiKeySummary[]>(`${this.basePath}/api-keys`)
  }

  async createApiKey(name: string): Promise<CreateApiKeyResponse> {
    return apiClient.post<CreateApiKeyResponse>(`${this.basePath}/api-keys`, { name })
  }

  async revokeApiKey(keyId: string): Promise<void> {
    return apiClient.delete(`${this.basePath}/api-keys/${keyId}`)
  }

  async deleteWorkspace(): Promise<void> {
    return apiClient.delete(`${this.basePath}/`)
  }
}

export const organizationsService = new OrganizationsService()
