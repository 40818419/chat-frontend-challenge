import { describe, it, expect, afterEach, vi } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import History from "./History"
import { Message } from "@/app/types"

afterEach(cleanup)

const defaultProps = {
  data: [] as Message[],
  isPending: false,
  error: null,
  fetchPreviousPage: vi.fn(),
  hasPreviousPage: false,
  isFetchingPreviousPage: false,
}

function createMessage(id: string, author: string = "Alice"): Message {
  return {
    _id: id,
    message: `message-${id}`,
    author,
    createdAt: "2025-06-15T14:30:00Z",
  }
}

describe("History", () => {
  it("shows 'Loading...' with status role when isPending", () => {
    render(<History {...defaultProps} isPending={true} />)
    expect(screen.getByRole("status")).toBeDefined()
    expect(screen.getByText("Loading...")).toBeDefined()
  })

  it("shows error message with alert role when error", () => {
    render(<History {...defaultProps} error={new Error("Something went wrong")} />)
    expect(screen.getByRole("alert")).toBeDefined()
    expect(screen.getByText("Error: Something went wrong")).toBeDefined()
  })

  it("renders list of Bubble items when data provided", () => {
    const messages = [createMessage("1"), createMessage("2")]
    render(<History {...defaultProps} data={messages} />)
    expect(screen.getByRole("log", { name: "Chat history" })).toBeDefined()
    expect(screen.getByText("message-1")).toBeDefined()
    expect(screen.getByText("message-2")).toBeDefined()
  })

  it("renders empty list when data is empty array", () => {
    render(<History {...defaultProps} />)
    const list = screen.getByRole("list", { name: "Messages" })
    expect(list).toBeDefined()
    expect(list.querySelectorAll("li")).toHaveLength(1) // sentinel only
  })
})
