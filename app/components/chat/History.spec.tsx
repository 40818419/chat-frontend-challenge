import { describe, it, expect, afterEach, beforeEach, vi, type Mock } from "vitest"
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

let observerCallback: IntersectionObserverCallback
let observerInstance: { observe: Mock; disconnect: Mock; unobserve: Mock }

beforeEach(() => {
  observerInstance = {
    observe: vi.fn(),
    disconnect: vi.fn(),
    unobserve: vi.fn(),
  }
  vi.stubGlobal(
    "IntersectionObserver",
    vi.fn(function (this: unknown, cb: IntersectionObserverCallback) {
      observerCallback = cb
      return observerInstance
    }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

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

  describe("IntersectionObserver", () => {
    it("creates observer and observes sentinel element", () => {
      render(<History {...defaultProps} />)
      expect(IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        { threshold: 0.2 },
      )
      expect(observerInstance.observe).toHaveBeenCalledOnce()
      const observedEl = observerInstance.observe.mock.calls[0][0] as HTMLElement
      expect(observedEl.tagName).toBe("LI")
      expect(observedEl.getAttribute("aria-hidden")).toBe("true")
    })

    it("disconnects observer on unmount", () => {
      const { unmount } = render(<History {...defaultProps} />)
      expect(observerInstance.disconnect).not.toHaveBeenCalled()
      unmount()
      expect(observerInstance.disconnect).toHaveBeenCalledOnce()
    })

    it("calls fetchPreviousPage when sentinel intersects and hasPreviousPage is true", () => {
      const fetchPreviousPage = vi.fn()
      render(
        <History
          {...defaultProps}
          data={[createMessage("1")]}
          hasPreviousPage={true}
          fetchPreviousPage={fetchPreviousPage}
        />,
      )

      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        observerInstance as unknown as IntersectionObserver,
      )

      expect(fetchPreviousPage).toHaveBeenCalledOnce()
    })

    it("does NOT call fetchPreviousPage when hasPreviousPage is false", () => {
      const fetchPreviousPage = vi.fn()
      render(
        <History
          {...defaultProps}
          hasPreviousPage={false}
          fetchPreviousPage={fetchPreviousPage}
        />,
      )

      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        observerInstance as unknown as IntersectionObserver,
      )

      expect(fetchPreviousPage).not.toHaveBeenCalled()
    })

    it("does NOT call fetchPreviousPage when isFetchingPreviousPage is true", () => {
      const fetchPreviousPage = vi.fn()
      render(
        <History
          {...defaultProps}
          hasPreviousPage={true}
          isFetchingPreviousPage={true}
          fetchPreviousPage={fetchPreviousPage}
        />,
      )

      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        observerInstance as unknown as IntersectionObserver,
      )

      expect(fetchPreviousPage).not.toHaveBeenCalled()
    })

    it("does NOT call fetchPreviousPage when sentinel is not intersecting", () => {
      const fetchPreviousPage = vi.fn()
      render(
        <History
          {...defaultProps}
          hasPreviousPage={true}
          fetchPreviousPage={fetchPreviousPage}
        />,
      )

      observerCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        observerInstance as unknown as IntersectionObserver,
      )

      expect(fetchPreviousPage).not.toHaveBeenCalled()
    })

    it("scrolls to anchor element after fetch completes", () => {
      const scrollIntoView = vi.fn()

      const messages = [createMessage("1"), createMessage("2")]
      const { rerender } = render(
        <History
          {...defaultProps}
          data={messages}
          hasPreviousPage={true}
          isFetchingPreviousPage={false}
        />,
      )

      // Simulate intersection — sets scrollAnchorIdRef to data[0]._id ("1") and calls fetchPreviousPage
      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        observerInstance as unknown as IntersectionObserver,
      )

      // Rerender as fetching (wasFetchingRef becomes true)
      rerender(
        <History
          {...defaultProps}
          data={messages}
          hasPreviousPage={true}
          isFetchingPreviousPage={true}
        />,
      )

      // Attach scrollIntoView mock to the anchor element
      const anchorEl = document.querySelector('[data-msg-id="1"]')
      expect(anchorEl).not.toBeNull()
      anchorEl!.scrollIntoView = scrollIntoView

      // Rerender as done fetching — triggers useLayoutEffect scroll
      rerender(
        <History
          {...defaultProps}
          data={[createMessage("0"), ...messages]}
          hasPreviousPage={true}
          isFetchingPreviousPage={false}
        />,
      )

      expect(scrollIntoView).toHaveBeenCalledWith({ block: "start" })
    })
  })

  describe("Accessibility & Structure", () => {
    it("sentinel element has aria-hidden='true'", () => {
      render(<History {...defaultProps} />)
      const list = screen.getByRole("list", { name: "Messages" })
      const sentinel = list.querySelector("li:first-child")
      expect(sentinel).not.toBeNull()
      expect(sentinel!.getAttribute("aria-hidden")).toBe("true")
    })

    it("each message li has data-msg-id attribute", () => {
      const messages = [createMessage("a1"), createMessage("b2")]
      render(<History {...defaultProps} data={messages} />)
      const list = screen.getByRole("list", { name: "Messages" })
      const items = list.querySelectorAll("li[data-msg-id]")
      expect(items).toHaveLength(2)
      expect(items[0].getAttribute("data-msg-id")).toBe("a1")
      expect(items[1].getAttribute("data-msg-id")).toBe("b2")
    })
  })
})
