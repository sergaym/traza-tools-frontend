export interface User {
  id: string
  external_id: string
  metadata: Record<string, unknown>
}

export interface CreateUserRequest {
  external_id: string
  metadata?: Record<string, unknown>
}
