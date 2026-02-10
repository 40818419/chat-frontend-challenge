import { Message } from "../types";
import { Block } from "./ui/Block";
import { ChatBubble } from "./ChatBubble";

type ChatHistoryProps = {
  data: Message[]
  isPending: boolean;
  error: Error | null
}

export default function ChatHistory({ data, isPending, error }: ChatHistoryProps) {
  if (isPending) return <Block>Loading...</Block>
  if (error) return <Block>{String(error)}</Block>

  return  (<div className="flex w-full flex-col-reverse flex-1 max-w-md overflow-y-auto px-6">
      <ul className="space-y-4 py-4">
        {data?.map(item => <li key={item._id}>
          <ChatBubble item={item} />
        </li>)}
      </ul>
    </div>
  )
}
