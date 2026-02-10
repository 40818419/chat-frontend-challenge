import clsx from "clsx"
import { format } from "date-fns"
import { AUTHOR } from "./Container"
import { Message } from "@/app/types"
import { Card } from "../ui/Card"

export function Bubble({ item }: { item: Message }) {
  const isOwnMessage = item.author === AUTHOR
  return (
    <Card align={isOwnMessage ? "end" : "start"} variant={isOwnMessage ? "primary" : "default"}>
      {!isOwnMessage && <p className="text-xs text-gray-400">{item.author}</p>}
      <p>{item.message}</p>
      <p className={clsx('text-xs text-gray-400', isOwnMessage ? 'text-end' : 'text-start')}>
        {format(new Date(item.createdAt), "dd MMM yyyy HH:mm")}
      </p>
    </Card>
  )
}
