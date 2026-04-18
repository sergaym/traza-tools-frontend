import { apiClient } from "@/lib/api-client"
import type { CursorPaginated } from "@/lib/types"
import type { ToolSummary, ToolDetail, ExecutionLog, ExecutionLogDetail, ExecuteToolRequest } from "@/modules/tools/types"

class ToolsService {
  private readonly basePath = "/v1/tools"

  async getAll(params?: { limit?: number; starting_after?: string }): Promise<CursorPaginated<ToolSummary>> {
    return apiClient.get<CursorPaginated<ToolSummary>>(`${this.basePath}/`, params)
  }

  async getBySlug(toolSlug: string): Promise<ToolDetail> {
    return apiClient.get<ToolDetail>(`${this.basePath}/${toolSlug}`)
  }

  async execute(toolSlug: string, data: ExecuteToolRequest): Promise<unknown> {
    return apiClient.post(`${this.basePath}/execute/${toolSlug}`, data)
  }

  async getLogs(): Promise<ExecutionLog[]> {
    return apiClient.get<ExecutionLog[]>(`${this.basePath}/logs`)
  }

  async getLogById(logId: string): Promise<ExecutionLogDetail> {
    return apiClient.get<ExecutionLogDetail>(`${this.basePath}/logs/${logId}`)
  }
}

export const toolsService = new ToolsService()
