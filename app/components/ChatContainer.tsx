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
      <div className="flex w-full flex-col flex-1 max-w-md overflow-y-auto">
        <ChatHistory data={data} isPending={isPending} error={error} />
      </div>
      <ChatInput />
    </>
  )
}