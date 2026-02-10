import { useEffect } from 'react'                                
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query' 
import { API } from '../service/api'
import { Message } from '../types'
import { deduplicateMessages } from '../utils/deduplicateMessages'

const QUERY_KEY = 'messages'
const POLLING_INTERVAL = Number(process.env.NEXT_PUBLIC_POLLING_INTERVAL) || 3000

export function useMessages() {
  const queryClient = useQueryClient()

  const { data, isPending, error } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => API.get(),
  })

  const lastMessageDate = data?.at(-1)?.createdAt

  const { data: newMessages } = useQuery({
    queryKey: [QUERY_KEY, 'poll'],
    queryFn: () => API.get({ after: lastMessageDate, limit: 10 }),
    enabled: !!lastMessageDate,
    refetchInterval: POLLING_INTERVAL,
  })

  useEffect(() => {
    if (newMessages && newMessages.length > 0) {
      queryClient.setQueryData([QUERY_KEY], (prev: Message[]) => deduplicateMessages(prev, newMessages))
    }
  }, [newMessages, queryClient])


  const sendMessage = useMutation({
    mutationFn: API.post,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    }
  })

  return { data, isPending, error, sendMessage }
}