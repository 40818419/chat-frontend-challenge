import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { format } from "date-fns"
import { Bubble } from "./Bubble"
import { AUTHOR } from "./Container"
import { Message } from "@/app/types"

afterEach(cleanup)

const CREATED_AT = "2025-06-15T14:30:00Z"
const EXPECTED_TIMESTAMP = format(new Date(CREATED_AT), "dd MMM yyyy HH:mm")

function createMessage(overrides: Partial<Message> = {}): Message {
  return {
    _id: "1",
    message: "Hello world",
    author: "Alice",
    createdAt: CREATED_AT,
    ...overrides,
  }
}

describe("Bubble", () => {
  it("renders message text", () => {
    render(<Bubble item={createMessage()} />)
    expect(screen.getByText("Hello world")).toBeDefined()
  })

  it("shows author name visibly for non-own messages", () => {
    render(<Bubble item={createMessage()} />)
    const authorElements = screen.getAllByText("Alice")
    const visibleAuthor = authorElements.find(el => !el.className.includes("sr-only"))
    expect(visibleAuthor).toBeDefined()
    expect(visibleAuthor!.tagName).toBe("P")
  })

  it("hides author name with sr-only for own messages", () => {
    render(<Bubble item={createMessage({ author: AUTHOR })} />)
    const authorEl = screen.getByText(AUTHOR)
    expect(authorEl.className).toContain("sr-only")
  })

  it("formats timestamp with date-fns", () => {
    render(<Bubble item={createMessage()} />)
    expect(screen.getByText(EXPECTED_TIMESTAMP)).toBeDefined()
  })

  it("aligns Card 'end' for own messages", () => {
    const { container } = render(<Bubble item={createMessage({ author: AUTHOR })} />)
    const outer = container.firstElementChild as HTMLElement
    expect(outer.className).toContain("justify-end")
  })

  it("aligns Card 'start' for other messages", () => {
    const { container } = render(<Bubble item={createMessage()} />)
    const outer = container.firstElementChild as HTMLElement
    expect(outer.className).toContain("justify-start")
  })

  it("sets correct aria-label with author and timestamp", () => {
    render(<Bubble item={createMessage()} />)
    expect(screen.getByLabelText(`Message from Alice, ${EXPECTED_TIMESTAMP}`)).toBeDefined()
  })
})
