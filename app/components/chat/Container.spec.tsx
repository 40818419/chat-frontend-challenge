import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"

vi.mock("../../hooks/useMessages", () => ({
  useMessages: vi.fn(() => ({
    data: [
      { _id: "1", message: "Hello", author: "Alice", createdAt: "2025-06-15T14:30:00Z" },
    ],
    isPending: false,
    error: null,
    sendMessage: {
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      reset: vi.fn(),
      data: undefined,
      error: null,
      isError: false,
      isIdle: true,
      isPending: false,
      isSuccess: false,
      status: "idle",
      variables: undefined,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      submittedAt: 0,
    },
    fetchPreviousPage: vi.fn(),
    hasPreviousPage: false,
    isFetchingPreviousPage: false,
  })),
}))

import ChatContainer from "./Container"

afterEach(cleanup)

describe("ChatContainer", () => {
  it("renders History and Form components", () => {
    render(<ChatContainer />)
    expect(screen.getByRole("log", { name: "Chat history" })).toBeDefined()
    expect(screen.getByRole("form", { name: "Send a message" })).toBeDefined()
    expect(screen.getByText("Hello")).toBeDefined()
  })
})
