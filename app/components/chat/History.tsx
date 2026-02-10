import { Message } from "../../types";
import { Block } from "../ui/Block";
import { Bubble } from "./Bubble";

type HistoryProps = {
  data: Message[]
  isPending: boolean;
  error: Error | null
}

export default function History({ data, isPending, error }: HistoryProps) {
  if (isPending) return <Block>Loading...</Block>
  if (error) return <Block>{String(error)}</Block>

  return  (<div className="flex w-full flex-col-reverse items-center flex-1 overflow-y-auto">
      <ul className="space-y-4 max-w-md py-4 px-6">
        {data?.map(item => <li key={item._id}>
          <Bubble item={item} />
        </li>)}
      </ul>
    </div>
  )
}
