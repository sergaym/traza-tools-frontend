export interface Session {
  id: string
  user_id: string
  toolkit_ids: string[] | null
  connected_accounts: Record<string, string>
  created_at: string
}

export interface CreateSessionRequest {
  user_id: string
  toolkit_ids?: string[] | null
  connected_accounts?: Record<string, string>
}

export interface ToolSearchResult {
  tool_slug: string
  tool_name: string
  description: string
  tags: string[]
}

export interface ToolSchemaResponse {
  tool_slug: string
  provider_id: string
  tool_id: string
  name: string
  description: string | null
  version: string
  parameters: Record<string, unknown>
  response: Record<string, unknown>
}

export interface SessionExecuteToolRequest {
  tool_slug: string
  arguments?: Record<string, unknown>
}
