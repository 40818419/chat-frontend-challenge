import { vi } from 'vitest'

// jsdom doesn't implement IntersectionObserver
vi.stubGlobal('IntersectionObserver', class IntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
  takeRecords = vi.fn().mockReturnValue([])
  root = null
  rootMargin = ''
  thresholds = []
  constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {}
})
