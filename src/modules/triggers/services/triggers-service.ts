import { apiClient } from "@/lib/api-client"
import type { TriggerSubscription, SubscribeRequest } from "@/modules/triggers/types"

class TriggersService {
  private readonly basePath = "/v1/triggers"

  async subscribe(data: SubscribeRequest): Promise<TriggerSubscription> {
    return apiClient.post<TriggerSubscription>(`${this.basePath}/subscribe`, data)
  }

  async getAll(userId: string, params?: { provider_id?: string }): Promise<TriggerSubscription[]> {
    return apiClient.get<TriggerSubscription[]>(`${this.basePath}/`, {
      user_id: userId,
      ...params,
    })
  }

  async getById(subscriptionId: string): Promise<TriggerSubscription> {
    return apiClient.get<TriggerSubscription>(`${this.basePath}/${subscriptionId}`)
  }

  async unsubscribe(subscriptionId: string): Promise<void> {
    return apiClient.delete(`${this.basePath}/${subscriptionId}`)
  }
}

export const triggersService = new TriggersService()
