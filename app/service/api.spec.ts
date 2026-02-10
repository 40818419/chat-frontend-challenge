import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { API } from "./api"

function mockResponse(data: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    statusText: ok ? "OK" : "Internal Server Error",
    json: () => Promise.resolve(data),
  }
}

describe("API", () => {
  const mockFetch = vi.fn()

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("get", () => {
    it("calls /api/messages with no params when none provided", async () => {
      mockFetch.mockResolvedValue(mockResponse([]))
      await API.get()
      expect(mockFetch).toHaveBeenCalledWith("/api/messages")
    })

    it("appends after query param when provided", async () => {
      mockFetch.mockResolvedValue(mockResponse([]))
      await API.get({ after: "abc123" })
      expect(mockFetch).toHaveBeenCalledWith("/api/messages?after=abc123")
    })

    it("appends limit query param when provided", async () => {
      mockFetch.mockResolvedValue(mockResponse([]))
      await API.get({ limit: 10 })
      expect(mockFetch).toHaveBeenCalledWith("/api/messages?limit=10")
    })

    it("appends both params when both provided", async () => {
      mockFetch.mockResolvedValue(mockResponse([]))
      await API.get({ after: "abc123", limit: 5 })
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/messages?after=abc123&limit=5"
      )
    })

    it("returns parsed JSON on success", async () => {
      const data = [{ _id: "1", message: "hello" }]
      mockFetch.mockResolvedValue(mockResponse(data))
      const result = await API.get()
      expect(result).toEqual(data)
    })

    it("throws on non-ok response", async () => {
      mockFetch.mockResolvedValue(mockResponse(null, false, 500))
      await expect(API.get()).rejects.toThrow("Internal Server Error")
    })
  })

  describe("post", () => {
    const body = { message: "hello", author: "test-user" }

    it("sends POST with JSON body and correct headers", async () => {
      mockFetch.mockResolvedValue(mockResponse({}))
      await API.post(body)
      expect(mockFetch).toHaveBeenCalledWith("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
    })

    it("returns parsed JSON on success", async () => {
      const data = { _id: "1", message: "hello", author: "test-user" }
      mockFetch.mockResolvedValue(mockResponse(data))
      const result = await API.post(body)
      expect(result).toEqual(data)
    })

    it("throws on non-ok response", async () => {
      mockFetch.mockResolvedValue(mockResponse(null, false, 500))
      await expect(API.post(body)).rejects.toThrow(
        "Failed to post message: 500"
      )
    })
  })
})
