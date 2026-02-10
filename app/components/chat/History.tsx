import { useEffect, useLayoutEffect, useRef } from "react";
import { Message } from "../../types";
import { Block } from "../ui/Block";
import { Bubble } from "./Bubble";

type HistoryProps = {
  data: Message[]
  isPending: boolean;
  error: Error | null
  fetchPreviousPage: () => void
  hasPreviousPage: boolean
  isFetchingPreviousPage: boolean
}

export default function History({ data, isPending, error, fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage }: HistoryProps) {
  const sentinelRef = useRef<HTMLLIElement>(null)
  const scrollAnchorIdRef = useRef<string | null>(null)
  const wasFetchingRef = useRef(false)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasPreviousPage && !isFetchingPreviousPage) {
          if (data.length > 0) {
            scrollAnchorIdRef.current = data[0]._id
          }
          fetchPreviousPage()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [data, fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage])

  useLayoutEffect(() => {
    if (wasFetchingRef.current && !isFetchingPreviousPage && scrollAnchorIdRef.current) {
      const anchorEl = document.querySelector(`[data-msg-id="${scrollAnchorIdRef.current}"]`)
      if (anchorEl) {
        anchorEl.scrollIntoView({ block: "start" })
      }
      scrollAnchorIdRef.current = null
    }
    wasFetchingRef.current = isFetchingPreviousPage
  }, [isFetchingPreviousPage])

  if (isPending) return <Block role="status" aria-live="polite">Loading...</Block>
  if (error) return <Block role="alert">{String(error)}</Block>

  return (
    <div
      role="log"
      aria-label="Chat history"
      className="flex w-full flex-col-reverse overflow-y-auto items-center flex-1"
    >
      <ul aria-label="Messages" className="space-y-4 w-full max-w-md py-4 px-6">
        <li ref={sentinelRef} aria-hidden="true" className="h-5"></li>
        {data?.map(item => (
          <li key={item._id} data-msg-id={item._id}>
            <Bubble item={item} />
          </li>
        ))}
      </ul>
    </div>
  )
}
