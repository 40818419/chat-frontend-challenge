import { describe, it, expect } from "vitest"
import { deduplicateMessages } from "./deduplicateMessages"
import { Message } from "../types"

function createMessage(id: string): Message {
  return {
    _id: id,
    message: `message-${id}`,
    author: `author-${id}`,
    createdAt: new Date().toISOString(),
  }
}

describe("deduplicateMessages", () => {
  const a = createMessage("a")
  const b = createMessage("b")
  const c = createMessage("c")

  it("returns new messages when prev is empty", () => {
    const result = deduplicateMessages([], [a, b])
    expect(result).toEqual([a, b])
  })

  it("returns prev when newMessages array is empty", () => {
    const result = deduplicateMessages([a, b], [])
    expect(result).toEqual([a, b])
  })

  it("returns same reference when all newMessages are duplicates", () => {
    const prev = [a, b]
    const result = deduplicateMessages(prev, [a])
    expect(result).toBe(prev)
  })

  it("appends only unique messages", () => {
    const result = deduplicateMessages([a], [a, b])
    expect(result).toEqual([a, b])
  })

  it("appends all when no duplicates", () => {
    const result = deduplicateMessages([a], [b, c])
    expect(result).toEqual([a, b, c])
  })

  it("returns empty array when both arrays are empty", () => {
    const prev: Message[] = []
    const result = deduplicateMessages(prev, [])
    expect(result).toBe(prev)
    expect(result).toEqual([])
  })

  it("preserves message order (prev first, then new)", () => {
    const result = deduplicateMessages([b, a], [c])
    expect(result).toEqual([b, a, c])
  })

  it("returns same reference when no unique messages found", () => {
    const prev = [a, b, c]
    const result = deduplicateMessages(prev, [a, b, c])
    expect(result).toBe(prev)
  })
})
