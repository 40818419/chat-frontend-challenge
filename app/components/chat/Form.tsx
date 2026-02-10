'use client'

import { UseMutationResult } from "@tanstack/react-query"
import { useRef, useState, SubmitEvent } from "react"
import Input from "../ui/Input"
import Button from "../ui/Button"
import { CreateMessageBody, Message } from "../../types"
import { AUTHOR } from '../../utils/author'

type FormProps = {
  sendMessage: UseMutationResult<Message, Error, CreateMessageBody>
}

export default function Form({ sendMessage }: FormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [statusMessage, setStatusMessage] = useState('')

  const isPending = sendMessage.isPending

  const onFormSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputRef.current) return

    if (inputRef.current.value.trim() === '') {
      setStatusMessage('Please enter a message before sending.')
      return
    }

    setStatusMessage('')

    sendMessage.mutate({
      message: inputRef.current.value,
      author: AUTHOR,
    }, {
      onSuccess: () => {
        formRef.current?.reset()
        setStatusMessage('Message sent.')
        inputRef.current?.focus()
      },
      onError: () => {
        setStatusMessage('Failed to send message. Please try again.')
        inputRef.current?.focus()
      },
    })
  }

  return (
    <div className="flex w-full justify-center bg-curious-blue sticky bottom-0">
      <div className="flex max-w-md w-full py-2">
        <form
          ref={formRef}
          className="flex flex-row w-full px-2 md:px-6"
          aria-label="Send a message"
          onSubmit={onFormSubmit}
        >
          <Input
            ref={inputRef}
            aria-label="Type a message"
            placeholder="Message"
            required
            type="text"
            disabled={isPending}
          />
          <Button
            type="submit"
            disabled={isPending}
            aria-busy={isPending}
            aria-label="Send message"
          >
            {isPending ? 'Sending…' : 'Send'}
          </Button>
        </form>
        <div className="sr-only" aria-live="polite" role="status">
          {statusMessage}
        </div>
      </div>
    </div>
  )
}
