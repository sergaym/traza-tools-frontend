export interface ProviderSummary {
  id: string
  name: string
}

export interface ProviderDetail {
  id: string
  name: string
  tool_count: number
  trigger_count: number
}

export interface ProviderToolItem {
  tool_slug: string
  tool_id: string
  name: string
  description: string | null
}

export interface ProviderConnectionItem {
  connection_id: string
  name: string
  description: string | null
}
