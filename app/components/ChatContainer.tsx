'use client'

import ChatInput from './ChatInput'
import ChatHistory from './ChatHistory'
import { useMessages } from '../hooks/useMessages'

export const AUTHOR = 'John Doe'

export default function ChatContainer() {
  const { data, sendMessage, isPending, error } = useMessages()

  return (<>
      <ChatHistory data={data} isPending={isPending} error={error} />
      <ChatInput sendMessage={sendMessage} />
    </>
  )
}