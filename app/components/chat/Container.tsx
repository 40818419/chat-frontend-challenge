'use client'

import Form from './Form'
import History from './History'
import { useMessages } from '../../hooks/useMessages'

// hardcoded author is defined here, usually we get this from auth service
export const AUTHOR = 'John Doe'

export default function ChatContainer() {
  const { data, sendMessage, isPending, error } = useMessages()

  return (<>
      <History data={data} isPending={isPending} error={error} />
      <Form sendMessage={sendMessage} />
    </>
  )
}
