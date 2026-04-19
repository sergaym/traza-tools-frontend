export interface Account {
  id: string
  external_id: string
  metadata: Record<string, unknown>
  connection_count?: number
  created_at: string | null
}

export interface CreateAccountRequest {
  external_id: string
  metadata?: Record<string, unknown>
}
