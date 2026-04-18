export interface ConnectLink {
  id: string
  url: string
  expires_at: string
}

export interface CreateConnectLinkRequest {
  user_id: string
  provider_id: string
  connection_id: string
  redirect_url?: string | null
}
