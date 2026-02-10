'use client'

import { useQuery } from '@tanstack/react-query'
import ChatInput from './ChatInput'
import ChatHistory from './ChatHistory'
import { API } from '../service/api'

export default function ChatContainer() {
  const { data, isPending, error } = useQuery({
    queryKey: ['messages'],
    queryFn: API.get,
  })

  return (<>
      <ChatHistory data={data} isPending={isPending} error={error} />
      <ChatInput />
    </>
  )
}