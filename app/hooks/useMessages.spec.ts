import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode } from 'react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import type { Message } from '../types'
import { useMessages } from './useMessages'

vi.mock('../service/api', () => ({
  API: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

import { API } from '../service/api'

const mockedGet = vi.mocked(API.get)
const mockedPost = vi.mocked(API.post)

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

const fakeMessages: Message[] = [
  { _id: '1', message: 'Hello', author: 'Alice', createdAt: '2025-01-01T00:00:00Z' },
  { _id: '2', message: 'World', author: 'Bob', createdAt: '2025-01-01T00:01:00Z' },
]

describe('useMessages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initial fetch', () => {
    it('returns isPending true initially', () => {
      mockedGet.mockReturnValue(new Promise(() => {}))

      const { result } = renderHook(() => useMessages(), { wrapper: createWrapper() })

      expect(result.current.isPending).toBe(true)
      expect(result.current.data).toBeUndefined()
    })

    it('returns fetched messages as data after resolve', async () => {
      mockedGet.mockResolvedValueOnce(fakeMessages)

      const { result } = renderHook(() => useMessages(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isPending).toBe(false)
      })

      expect(result.current.data).toEqual(fakeMessages)
      expect(result.current.error).toBeNull()
    })

    it('returns error when API.get rejects', async () => {
      mockedGet.mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useMessages(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.error).toBeTruthy()
      })

      expect(result.current.error).toBeInstanceOf(Error)
      expect((result.current.error as Error).message).toBe('Network error')
    })
  })

  describe('polling', () => {
    it('enables poll query with after set to last message createdAt', async () => {
      mockedGet.mockResolvedValueOnce(fakeMessages)
      // Poll query returns empty
      mockedGet.mockResolvedValueOnce([])

      const { result } = renderHook(() => useMessages(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.data).toEqual(fakeMessages)
      })

      await waitFor(() => {
        expect(mockedGet).toHaveBeenCalledWith({
          after: '2025-01-01T00:01:00Z',
          limit: 10,
        })
      })
    })

    it('merges polled messages without duplicates', async () => {
      mockedGet.mockResolvedValueOnce(fakeMessages)

      const polledMessages: Message[] = [
        // Duplicate of existing message
        { _id: '2', message: 'World', author: 'Bob', createdAt: '2025-01-01T00:01:00Z' },
        // New message
        { _id: '3', message: 'New!', author: 'Charlie', createdAt: '2025-01-01T00:02:00Z' },
      ]
      mockedGet.mockResolvedValueOnce(polledMessages)

      const { result } = renderHook(() => useMessages(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.data).toHaveLength(3)
      })

      const ids = result.current.data!.map((message: Message) => message._id)
      expect(ids).toEqual(['1', '2', '3'])
    })
  })

  describe('sendMessage mutation', () => {
    it('calls API.post with the provided body', async () => {
      mockedGet.mockResolvedValue(fakeMessages)
      mockedPost.mockResolvedValueOnce({ _id: '4', message: 'Hi', author: 'Dan', createdAt: '2025-01-01T00:03:00Z' })

      const { result } = renderHook(() => useMessages(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isPending).toBe(false)
      })

      await act(async () => {
        result.current.sendMessage.mutate({ message: 'Hi', author: 'Dan' })
      })

      await waitFor(() => {
        expect(mockedPost).toHaveBeenCalledWith(
          { message: 'Hi', author: 'Dan' },
          expect.anything(),
        )
      })
    })

    it('invalidates messages query on success (triggers refetch)', async () => {
      mockedGet.mockResolvedValue(fakeMessages)
      mockedPost.mockResolvedValueOnce({ _id: '4', message: 'Hi', author: 'Dan', createdAt: '2025-01-01T00:03:00Z' })

      const { result } = renderHook(() => useMessages(), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(result.current.isPending).toBe(false)
      })

      const callCountBefore = mockedGet.mock.calls.length

      await act(async () => {
        result.current.sendMessage.mutate({ message: 'Hi', author: 'Dan' })
      })

      await waitFor(() => {
        expect(result.current.sendMessage.isSuccess).toBe(true)
      })

      // After mutation success, invalidation triggers additional get calls
      await waitFor(() => {
        expect(mockedGet.mock.calls.length).toBeGreaterThan(callCountBefore)
      })
    })
  })
})
