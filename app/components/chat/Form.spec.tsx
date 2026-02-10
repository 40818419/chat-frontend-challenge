import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react"
import Form from "./Form"
import { UseMutationResult } from "@tanstack/react-query"
import { CreateMessageBody, Message } from "@/app/types"

function createMockMutation(overrides: Record<string, unknown> = {}) {
  return {
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
    ...overrides,
  } as UseMutationResult<Message, Error, CreateMessageBody>
}

describe("Form", () => {
  let sendMessage: ReturnType<typeof createMockMutation>

  afterEach(cleanup)

  beforeEach(() => {
    sendMessage = createMockMutation()
  })

  it("renders input and send button", () => {
    render(<Form sendMessage={sendMessage} />)
    expect(screen.getByLabelText("Type a message")).toBeDefined()
    expect(screen.getByRole("button", { name: "Send message" })).toBeDefined()
  })

  it("shows validation message when submitting empty input", async () => {
    render(<Form sendMessage={sendMessage} />)
    fireEvent.submit(screen.getByRole("form", { name: "Send a message" }))

    await waitFor(() => {
      expect(screen.getByText("Please enter a message before sending.")).toBeDefined()
    })
    expect(sendMessage.mutate).not.toHaveBeenCalled()
  })

  it("calls sendMessage.mutate with correct payload on valid submit", async () => {
    render(<Form sendMessage={sendMessage} />)
    const input = screen.getByLabelText("Type a message")

    fireEvent.change(input, { target: { value: "Hello!" } })
    fireEvent.submit(screen.getByRole("form", { name: "Send a message" }))

    await waitFor(() => {
      expect(sendMessage.mutate).toHaveBeenCalledWith(
        { message: "Hello!", author: "John Doe" },
        expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
      )
    })
  })

  it("disables input and button when sendMessage.isPending", () => {
    sendMessage = createMockMutation({ isPending: true, status: "pending", isIdle: false })
    render(<Form sendMessage={sendMessage} />)

    expect((screen.getByLabelText("Type a message") as HTMLInputElement).disabled).toBe(true)
    expect((screen.getByRole("button", { name: "Send message" }) as HTMLButtonElement).disabled).toBe(true)
  })

  it("shows 'Sending...' text when pending", () => {
    sendMessage = createMockMutation({ isPending: true, status: "pending", isIdle: false })
    render(<Form sendMessage={sendMessage} />)
    expect(screen.getByText("Sending…")).toBeDefined()
  })

  it("shows success status message on successful send", async () => {
    const mutateMock = vi.fn((_variables, options) => {
      options?.onSuccess?.()
    })
    sendMessage = createMockMutation({ mutate: mutateMock })

    render(<Form sendMessage={sendMessage} />)
    const input = screen.getByLabelText("Type a message")

    fireEvent.change(input, { target: { value: "Hi" } })
    fireEvent.submit(screen.getByRole("form", { name: "Send a message" }))

    await waitFor(() => {
      expect(screen.getByText("Message sent.")).toBeDefined()
    })
  })

  it("shows error status message on failed send", async () => {
    const mutateMock = vi.fn((_variables, options) => {
      options?.onError?.(new Error("fail"))
    })
    sendMessage = createMockMutation({ mutate: mutateMock })

    render(<Form sendMessage={sendMessage} />)
    const input = screen.getByLabelText("Type a message")

    fireEvent.change(input, { target: { value: "Hi" } })
    fireEvent.submit(screen.getByRole("form", { name: "Send a message" }))

    await waitFor(() => {
      expect(screen.getByText("Failed to send message. Please try again.")).toBeDefined()
    })
  })
})
