'use client'

import { UseMutationResult } from "@tanstack/react-query"
import { useRef, SubmitEvent } from "react"
import Input from "./ui/Input"
import Button from "./ui/Button"
import { CreateMessageBody, Message } from "../types"

const AUTHOR = 'John Doe'

type ChatInputProps = {
  sendMessage: UseMutationResult<Message, Error, CreateMessageBody>
}

export default function ChatInput({ sendMessage }: ChatInputProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const onFormSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputRef.current) return
    if(inputRef.current.value.trim() === '') return

    sendMessage.mutate({
      message: inputRef.current.value,
      author: AUTHOR,
    }, {
      onSuccess: () => formRef.current?.reset(),
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