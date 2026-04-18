export type IntegrationStatus = "connected" | "disconnected" | "error"

export interface Integration {
  id: string
  name: string
  description: string
  category: string
  status: IntegrationStatus
  connected_at?: string
  logo_url?: string
}

export interface ConnectIntegrationPayload {
  integration_id: string
  credentials?: Record<string, string>
}
