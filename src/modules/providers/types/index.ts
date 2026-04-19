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

export type ConnectionType =
  | "oauth"
  | "oauth_custom_credentials"
  | "credentials"
  | "ntlm"
  | "sqs"
  | "no_auth"

export interface ProviderConnectionItem {
  connection_id: string
  name: string
  description: string | null
  connection_type: ConnectionType
}

export interface ConnectionFieldItem {
  name: string
  label: string
  type: string
  placeholder: string | null
  default: string | number | null
  help: string | null
  url: string | null
  required: boolean
}
