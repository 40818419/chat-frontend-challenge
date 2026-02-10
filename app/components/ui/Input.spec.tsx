import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { createRef } from "react"
import Input from "./Input"

afterEach(cleanup)

describe("Input", () => {
  it("renders with placeholder", () => {
    render(<Input placeholder="Type here" />)
    expect(screen.getByPlaceholderText("Type here")).toBeDefined()
  })

  it("applies disabled attribute and disabled styling classes", () => {
    render(<Input disabled aria-label="disabled input" />)
    const input = screen.getByRole("textbox")
    expect(input.hasAttribute("disabled")).toBe(true)
    expect(input.className).toContain("opacity-50")
    expect(input.className).toContain("cursor-not-allowed")
  })

  it("forwards ref correctly", () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input ref={ref} aria-label="ref input" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it("merges custom className", () => {
    render(<Input className="my-class" aria-label="styled input" />)
    const input = screen.getByRole("textbox")
    expect(input.className).toContain("my-class")
    expect(input.className).toContain("bg-white")
  })

  it("forwards additional props", () => {
    render(<Input type="email" aria-label="email field" />)
    expect(screen.getByLabelText("email field").getAttribute("type")).toBe("email")
  })
})
