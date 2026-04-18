import { apiClient } from "@/lib/api-client"
import type { Tool, ToolExecutePayload, ToolExecuteResult } from "@/modules/tools/types"

class ToolsService {
  private readonly basePath = "/api/v1/tools"

  async getAll(): Promise<Tool[]> {
    return apiClient.get<Tool[]>(`${this.basePath}/`)
  }

  async getByIntegration(integrationId: string): Promise<Tool[]> {
    return apiClient.get<Tool[]>(`${this.basePath}/`, { integration_id: integrationId })
  }

  async toggle(id: string, enabled: boolean): Promise<Tool> {
    return apiClient.patch<Tool>(`${this.basePath}/${id}`, { enabled })
  }

  async execute(payload: ToolExecutePayload): Promise<ToolExecuteResult> {
    return apiClient.post<ToolExecuteResult>(`${this.basePath}/execute`, payload)
  }
}

export const toolsService = new ToolsService()
