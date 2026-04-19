export interface OrganizationSummary {
  id: string
  name: string
}

export interface ApiKeySummary {
  id: string
  name: string
  created_at: string
  last_used_at: string | null
}

export interface CreateOrganizationResponse {
  organization: OrganizationSummary
  api_key: { id: string; name: string; key: string }
}

export interface CreateApiKeyResponse {
  id: string
  name: string
  key: string
}
