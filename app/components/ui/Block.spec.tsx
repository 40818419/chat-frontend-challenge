import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { Block } from "./Block"

afterEach(cleanup)

describe("Block", () => {
  it("renders children", () => {
    render(<Block>Block content</Block>)
    expect(screen.getByText("Block content")).toBeDefined()
  })

  it("applies role attribute", () => {
    render(<Block role="status">Status</Block>)
    expect(screen.getByRole("status")).toBeDefined()
  })

  it("applies aria-live attribute", () => {
    const { container } = render(<Block aria-live="polite">Live</Block>)
    expect(container.firstElementChild?.getAttribute("aria-live")).toBe("polite")
  })
})
