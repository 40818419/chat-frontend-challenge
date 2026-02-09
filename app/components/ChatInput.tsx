export default function ChatInput() {
  return (
    <div className="flex w-full justify-center bg-curious-blue sticky bottom-0">
      <div className="flex max-w-md w-full py-2">
        <form className="flex flex-row w-full px-6">
          <input className="mr-2 rounded-sm bg-white border-astral border-2 text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="Message" type="text"/>
          <button type="button" className="rounded-sm bg-salmon text-white font-semibold px-5 py-3">Send</button>
        </form>
      </div>
    </div>
  )
}