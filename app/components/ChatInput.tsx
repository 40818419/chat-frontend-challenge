'use client'

import { useMutation } from "@tanstack/react-query"
import { queryClient } from "../providers"
import { useRef, SubmitEvent } from "react"
import { API } from "../service/api"

const AUTHOR = 'John Doe'

export default function ChatInput() {
  const inputRef = useRef<HTMLInputElement>(null)

  const mutation = useMutation({
    mutationFn: API.post,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })

  const onFormSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputRef.current) return

    mutation.mutate({
      message: inputRef.current.value,
      author: AUTHOR,
    })
  }

  return (
    <div className="flex w-full justify-center bg-curious-blue sticky bottom-0">
      <div className="flex max-w-md w-full py-2">
        <form className="flex flex-row w-full px-6" onSubmit={onFormSubmit}>
          <input ref={inputRef} className="mr-2 rounded-sm bg-white border-astral border-2 text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="Message" type="text"/>
          <button type="button" className="rounded-sm bg-salmon text-white font-semibold px-5 py-3">Send</button>
        </form>
      </div>
    </div>
  )
}