'use client'

import Form from './Form'
import History from './History'
import { useMessages } from '../../hooks/useMessages'

export default function ChatContainer() {
  const { data, sendMessage, isPending, error } = useMessages()

  return (<>
      <History data={data} isPending={isPending} error={error} />
      <Form sendMessage={sendMessage} />
    </>
  )
}
