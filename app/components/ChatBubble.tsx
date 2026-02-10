import clsx from "clsx"
import { format } from "date-fns"
import { AUTHOR } from "./ChatContainer"
import { Message } from "@/app/types"
import { Bubble } from "./ui/Bubble"

export function ChatBubble({ item }: { item: Message }) {
  const isOwnMessage = item.author === AUTHOR
  return (
    <Bubble align={isOwnMessage ? "end" : "start"} variant={isOwnMessage ? "primary" : "default"}>
      {!isOwnMessage && <p className="text-xs text-gray-400">{item.author}</p>}
      <p>{item.message}</p>
      <p className={clsx('text-xs text-gray-400', isOwnMessage ? 'text-end' : 'text-start')}>
        {format(new Date(item.createdAt), "dd MMM yyyy HH:mm")}
      </p>
    </Bubble>
  )
}
