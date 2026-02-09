'use client'

import { useQuery } from '@tanstack/react-query'
import ChatInput from './ChatInput'
import ChatHistory from './ChatHistory'

export default function ChatContainer() {
  const { data, isPending, error } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const response = await fetch('/api/messages')

      if(!response.ok) {
        throw new Error(response.statusText)
      }
      return response.json()
    },
  })

  return (<>
      <div className="flex w-full flex-col flex-1 max-w-md overflow-y-auto">
        <ChatHistory data={data} isPending={isPending} error={error} />
      </div>
      <ChatInput />
    </>
  )
}