import { Message } from "../types"

// deduplication mechanism, filters sent message out of polled message array

export function deduplicateMessages(prev: Message[], newMessages: Message[]): Message[] {
  const existingIds = new Set(prev.map((message) => message._id))                                                    
  const unique = newMessages.filter((message: Message) => !existingIds.has(message._id))

  return unique.length > 0 ? [...prev, ...unique] : prev
}