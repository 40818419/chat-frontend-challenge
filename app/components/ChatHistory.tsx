import { Message } from "../types";
import { Block } from "./ui/Block";

type ChatHistoryProps = {
  data: Message[]
  isPending: boolean;
  error: Error | null
}

export default function ChatHistory({ data, isPending, error }: ChatHistoryProps) {
  if (isPending) return <Block>Loading...</Block>
  if (error) return <Block>{String(error)}</Block>

  return  (<div className="flex w-full flex-col flex-1 max-w-md overflow-y-auto justify-end px-6">
      <ul>{data?.map(t => <li key={t._id}>{t.message}</li>)}</ul>
    </div>
  )
}