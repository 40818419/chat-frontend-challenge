import clsx from "clsx"
import { format } from "date-fns"
import { AUTHOR } from "./Container"
import { Message } from "@/app/types"
import { Card } from "../ui/Card"

export function Bubble({ item }: { item: Message }) {
  const isOwnMessage = item.author === AUTHOR
  const timestamp = format(new Date(item.createdAt), "dd MMM yyyy HH:mm")
  const ariaLabel = `Message from ${item.author}, ${timestamp}`

  return (
    <Card align={isOwnMessage ? "end" : "start"} variant={isOwnMessage ? "primary" : "default"} aria-label={ariaLabel}>
      {isOwnMessage
        ? <span className="sr-only">{item.author}</span>
        : <p className="text-xs text-gray-500">{item.author}</p>
      }
      <p>{item.message}</p>
      <p className={clsx('text-xs text-gray-500', isOwnMessage ? 'text-end' : 'text-start')}>
        <time dateTime={new Date(item.createdAt).toISOString()}>{timestamp}</time>
      </p>
    </Card>
  )
}
