import clsx from "clsx"
import { format } from "date-fns"
import { AUTHOR } from "../ChatContainer"
import { Message } from "@/app/types"

export function Bubble({ item }: { item: Message }) {
  const isOwnMessage = item.author === AUTHOR
  return (
    <div className={clsx('flex w-full', isOwnMessage ? 'justify-end' : 'justify-start')}>
      <div className={clsx('rounded-sm border border-gray-300 p-4 max-w-[75%]', isOwnMessage ? 'bg-double-pearl-lusta' : 'bg-white')}>
        {!isOwnMessage && <p className="text-xs text-gray-400">{item.author}</p>}
        <p>{item.message}</p>
        <p className={clsx('text-xs text-gray-400', isOwnMessage ? 'text-end' : 'text-start')}>{format(new Date(item.createdAt), "dd MMM yyyy HH:mm")}</p>
      </div>
    </div>
  )
}