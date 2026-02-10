import { useEffect, useMemo, useRef } from "react"
import { Message } from "../../types";
import { Block } from "../ui/Block";
import { Bubble } from "./Bubble";

type HistoryProps = {
  data: Message[]
  isPending: boolean;
  error: Error | null
}

export default function History({ data, isPending, error }: HistoryProps) {
  if (isPending) return <Block role="status" aria-live="polite">Loading...</Block>
  if (error) return <Block role="alert">{String(error)}</Block>

  return (
    <div
      role="log"
      aria-label="Chat history"
      className="flex w-full flex-col-reverse overflow-y-auto items-center flex-1"
    >
      <ul aria-label="Messages" className="space-y-4 max-w-md py-4 px-6">
        {data?.map(item => (
          <li key={item._id}>
            <Bubble item={item} />
          </li>
        ))}
      </ul>
    </div>
  )
}
