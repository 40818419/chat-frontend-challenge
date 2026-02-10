import { useEffect } from 'react'
import { useInfiniteQuery, InfiniteData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { API } from '../service/api'
import { Message } from '../types'
import { deduplicateMessages } from '../utils/deduplicateMessages'

const QUERY_KEY = 'messages'
const POLLING_INTERVAL = Number(process.env.NEXT_PUBLIC_POLLING_INTERVAL) || 3000

export function useMessages() {
  const queryClient = useQueryClient()

  const {
    data: infiniteData,
    isPending,
    error,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY],
    queryFn: ({ pageParam }) =>
      pageParam ? API.get({ before: pageParam }) : API.get(),
    initialPageParam: undefined as string | undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.length > 0 ? firstPage[0].createdAt : undefined,
    getNextPageParam: () => undefined,
  })

  const messages = infiniteData?.pages.flat() ?? []
  const lastMessageDate = messages.at(-1)?.createdAt

  const { data: newMessages } = useQuery({
    queryKey: [QUERY_KEY, 'poll'],
    queryFn: () => API.get({ after: lastMessageDate, limit: 10 }),
    enabled: !!lastMessageDate,
    refetchInterval: POLLING_INTERVAL,
  })

  useEffect(() => {
    if (newMessages && newMessages.length > 0) {
      queryClient.setQueryData(
        [QUERY_KEY],
        (prev: InfiniteData<Message[]> | undefined) => {
          if (!prev) return prev
          const lastPage = prev.pages[prev.pages.length - 1]
          const deduped = deduplicateMessages(lastPage, newMessages)
          return {
            ...prev,
            pages: [...prev.pages.slice(0, -1), deduped],
          }
        }
      )
    }
  }, [newMessages, queryClient])

  const sendMessage = useMutation({
    mutationFn: API.post,
    onSuccess: (newMessage: Message) => {
      queryClient.setQueryData(
        [QUERY_KEY],
        (prev: InfiniteData<Message[]> | undefined) => {
          if (!prev) return prev
          const lastPage = prev.pages[prev.pages.length - 1]
          return {
            ...prev,
            pages: [...prev.pages.slice(0, -1), [...lastPage, newMessage]],
          }
        }
      )
    },
  })

  return {
    data: messages,
    isPending,
    error,
    sendMessage,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
  }
}
