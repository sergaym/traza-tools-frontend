import { apiClient } from "@/lib/api-client"
import type {
  Session,
  CreateSessionRequest,
  ToolSearchResult,
  ToolSchemaResponse,
  SessionExecuteToolRequest,
} from "@/modules/sessions/types"

class SessionsService {
  private readonly basePath = "/v1/sessions"

  async create(data: CreateSessionRequest): Promise<Session> {
    return apiClient.post<Session>(`${this.basePath}/`, data)
  }

  async getById(sessionId: string): Promise<Session> {
    return apiClient.get<Session>(`${this.basePath}/${sessionId}`)
  }

  async getTools(sessionId: string): Promise<unknown> {
    return apiClient.get(`${this.basePath}/${sessionId}/tools`)
  }

  async searchTools(sessionId: string, query: string, tags?: string[], limit = 20): Promise<ToolSearchResult[]> {
    return apiClient.post<ToolSearchResult[]>(`${this.basePath}/${sessionId}/search_tools`, { query, tags, limit })
  }

  async getToolSchema(sessionId: string, toolSlug: string): Promise<ToolSchemaResponse> {
    return apiClient.post<ToolSchemaResponse>(`${this.basePath}/${sessionId}/get_tool_schema`, { tool_slug: toolSlug })
  }

  async executeTool(sessionId: string, data: SessionExecuteToolRequest): Promise<unknown> {
    return apiClient.post(`${this.basePath}/${sessionId}/execute_tool`, data)
  }
}

export const sessionsService = new SessionsService()
