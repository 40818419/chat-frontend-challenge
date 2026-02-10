import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { Card } from "./Card"

afterEach(cleanup)

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText("Card content")).toBeDefined()
  })

  it("defaults to align='start' with justify-start class", () => {
    const { container } = render(<Card>Content</Card>)
    const outer = container.firstElementChild as HTMLElement
    expect(outer.className).toContain("justify-start")
  })

  it("applies align='end' with justify-end class", () => {
    const { container } = render(<Card align="end">Content</Card>)
    const outer = container.firstElementChild as HTMLElement
    expect(outer.className).toContain("justify-end")
  })

  it("defaults to variant='default' with bg-white class", () => {
    const { container } = render(<Card>Content</Card>)
    const inner = container.firstElementChild?.firstElementChild as HTMLElement
    expect(inner.className).toContain("bg-white")
  })

  it("applies variant='primary' with bg-double-pearl-lusta class", () => {
    const { container } = render(<Card variant="primary">Content</Card>)
    const inner = container.firstElementChild?.firstElementChild as HTMLElement
    expect(inner.className).toContain("bg-double-pearl-lusta")
  })

  it("forwards aria-label", () => {
    render(<Card aria-label="test card">Content</Card>)
    expect(screen.getByLabelText("test card")).toBeDefined()
  })
})
