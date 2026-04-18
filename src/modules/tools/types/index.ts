export interface ToolSummary {
  tool_slug: string
  provider_id: string
  tool_id: string
  name: string
  version: string
}

export interface ToolDetail {
  tool_slug: string
  provider_id: string
  tool_id: string
  name: string
  description: string | null
  version: string
  parameters: Record<string, unknown>
  response: Record<string, unknown>
}

export interface ExecutionLog {
  id: string
  provider_id: string
  tool_id: string
  connection_id: string | null
  status: string
  duration_ms: number | null
  error: string | null
  created_at: string | null
}

export interface ExecutionLogDetail extends ExecutionLog {
  user_id: string
  arguments: Record<string, unknown>
  result: Record<string, unknown> | null
}

export interface ExecuteToolRequest {
  user_id: string
  session_id?: string | null
  connected_account_id?: string | null
  version?: string | null
  arguments?: Record<string, unknown>
}
