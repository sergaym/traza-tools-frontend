export interface ProviderSummary {
  id: string
  name: string
  icon_url?: string | null
}

export interface ProviderDetail {
  id: string
  name: string
  icon_url?: string | null
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
