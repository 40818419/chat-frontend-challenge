import { Message } from "../types";

type ChatHistoryProps = {
  data: Message[]
  isPending: boolean;
  error: Error | null
}

export default function ChatHistory({ data, isPending, error }: ChatHistoryProps) {
  if (isPending) return <span>Loading...</span>
  if (error) return <span>{String(error)}</span>

  return  (
    <ul>{data?.map(t => <li key={t._id}>{t.message}</li>)}</ul>
  )
}