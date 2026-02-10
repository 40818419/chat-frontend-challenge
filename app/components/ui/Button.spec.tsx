import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import Button from "./Button"

afterEach(cleanup)

describe("Button", () => {
  it("renders children content", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: "Click me" })).toBeDefined()
  })

  it("defaults to type='button'", () => {
    render(<Button>OK</Button>)
    expect(screen.getByRole("button").getAttribute("type")).toBe("button")
  })

  it("accepts type='submit' override", () => {
    render(<Button type="submit">Send</Button>)
    expect(screen.getByRole("button").getAttribute("type")).toBe("submit")
  })

  it("applies disabled attribute and disabled styling classes", () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole("button")
    expect(button.hasAttribute("disabled")).toBe(true)
    expect(button.className).toContain("opacity-50")
    expect(button.className).toContain("cursor-not-allowed")
    expect(button.className).not.toContain("cursor-pointer")
  })

  it("applies cursor-pointer when not disabled", () => {
    render(<Button>Active</Button>)
    expect(screen.getByRole("button").className).toContain("cursor-pointer")
  })

  it("merges custom className", () => {
    render(<Button className="extra-class">Styled</Button>)
    const button = screen.getByRole("button")
    expect(button.className).toContain("extra-class")
    expect(button.className).toContain("bg-salmon")
  })

  it("forwards additional props", () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick} aria-label="custom label">Go</Button>)
    const button = screen.getByRole("button", { name: "custom label" })
    button.click()
    expect(onClick).toHaveBeenCalledOnce()
  })
})
