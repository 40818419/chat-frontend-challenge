import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import History from "./History"
import { Message } from "@/app/types"

afterEach(cleanup)

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
    render(<History data={[]} isPending={true} error={null} />)
    expect(screen.getByRole("status")).toBeDefined()
    expect(screen.getByText("Loading...")).toBeDefined()
  })

  it("shows error message with alert role when error", () => {
    render(<History data={[]} isPending={false} error={new Error("Something went wrong")} />)
    expect(screen.getByRole("alert")).toBeDefined()
    expect(screen.getByText("Error: Something went wrong")).toBeDefined()
  })

  it("renders list of Bubble items when data provided", () => {
    const messages = [createMessage("1"), createMessage("2")]
    render(<History data={messages} isPending={false} error={null} />)
    expect(screen.getByRole("log", { name: "Chat history" })).toBeDefined()
    expect(screen.getByText("message-1")).toBeDefined()
    expect(screen.getByText("message-2")).toBeDefined()
  })

  it("renders empty list when data is empty array", () => {
    render(<History data={[]} isPending={false} error={null} />)
    const list = screen.getByRole("list", { name: "Messages" })
    expect(list).toBeDefined()
    expect(list.querySelectorAll("li")).toHaveLength(0)
  })
})
