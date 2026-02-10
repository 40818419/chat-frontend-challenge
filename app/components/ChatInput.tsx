'use client'

import { useMutation } from "@tanstack/react-query"
import { queryClient } from "../providers"
import { useRef, SubmitEvent } from "react"
import { API } from "../service/api"
import Input from "./ui/Input"
import Button from "./ui/Button"

const AUTHOR = 'John Doe'

export default function ChatInput() {
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const mutation = useMutation({
    mutationFn: API.post,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      formRef.current?.reset()
    },
  })

  const onFormSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputRef.current) return
    if(inputRef.current.value.trim() === '') return

    mutation.mutate({
      message: inputRef.current.value,
      author: AUTHOR,
    })
  }

  return (
    <div className="flex w-full justify-center bg-curious-blue sticky bottom-0">
      <div className="flex max-w-md w-full py-2">
        <form ref={formRef} className="flex flex-row w-full px-6" onSubmit={onFormSubmit}>
          <Input ref={inputRef} placeholder="Message" type="text" />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  )
}