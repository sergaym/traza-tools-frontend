export interface TriggerSubscription {
  id: string
  user_id: string
  provider_id: string
  trigger_id: string
  connection_id: string
  status: string
  callback_url: string
  config: Record<string, unknown>
  created_at: string | null
}

export interface SubscribeRequest {
  user_id: string
  provider_id: string
  trigger_id: string
  connection_id: string
  config?: Record<string, unknown>
  callback_url: string
}
