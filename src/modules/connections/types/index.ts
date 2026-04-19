export interface Connection {
  id: string
  provider_id: string
  connection_id: string
  status: string
  created_at: string | null
  updated_at: string | null
  provider_name?: string | null
  provider_icon_url?: string | null
}

export interface CreateConnectionRequest {
  user_id: string
  provider_id: string
  connection_id: string
  credentials: Record<string, unknown>
}

export interface CreateConnectionResponse {
  id: string
  status: string
}

export interface InitiateOAuthRequest {
  user_id: string
  provider_id: string
  connection_id: string
  redirect_url?: string | null
}

export interface OAuthInitiateResponse {
  authorization_url: string
  state: string
}
