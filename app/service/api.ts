import { CreateMessageBody } from "../types"

export const API = {
  get: async () => {
    const response = await fetch('/api/messages')

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