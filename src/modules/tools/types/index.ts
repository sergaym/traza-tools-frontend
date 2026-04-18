export type ToolCategory = "read" | "write" | "action"

export interface Tool {
  id: string
  name: string
  description: string
  integration_id: string
  integration_name: string
  category: ToolCategory
  enabled: boolean
  calls_total: number
  schema?: Record<string, unknown>
}

export interface ToolExecutePayload {
  tool_id: string
  params: Record<string, unknown>
}

export interface ToolExecuteResult {
  success: boolean
  data?: unknown
  error?: string
  latency_ms: number
}
