import { CreateMessageBody } from "../types"

export const API = {
  get: async ({ after, before, limit }: { after?: string, before?: string, limit?: number } = {}) => {
    const params = new URLSearchParams()
    if (after) params.set('after', after)
    if (before) params.set('before', before)
    if (limit) params.set('limit', String(limit))
    const query = params.toString()

    const response = await fetch(`/api/messages${query ? `?${query}` : ''}`)

    if(!response.ok) {
      throw new Error(response.statusText)
    }
    return response.json()
  },
  post: async (body: CreateMessageBody) => {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      throw new Error(`Failed to post message: ${response.status}`)
    }
    return response.json()
  }
}