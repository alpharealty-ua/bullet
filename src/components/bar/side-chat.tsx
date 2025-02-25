import { useEffect, useRef, useState } from 'react'

import { mockMessageList } from '@/lib/mocks'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'

const SideChat = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState(mockMessageList)
  const [message, setMessage] = useState('')

  const scorllToBottom = () => {
    const wrapperDom = wrapperRef.current

    if (wrapperDom === null) {
      return
    }

    const messagesDom = wrapperDom.querySelector('[data-messages]')

    if (messagesDom === null) {
      return
    }

    messagesDom.scrollTop = messagesDom.scrollHeight
  }

  const addMessage = () => {
    const newMessage = { id: String(Date.now()), user: 'John Doe', message }
    setMessages((p) => [...p, newMessage])
    setMessage('')
  }

  useEffect(() => {
    scorllToBottom()
  }, [messages])

  return (
    <div
      ref={wrapperRef}
      className='flex h-full grow-1 flex-col justify-between gap-2 px-4'
    >
      <div
        className='custom-scroll flex grow flex-col gap-1 overflow-auto scroll-smooth'
        data-messages
      >
        {messages.map((message) => {
          return (
            <div key={message.id} className='flex flex-col gap-1 text-[10px]'>
              <div className='font-bold'>{message.user}:</div>
              <div className='font-roboto normal-case'>{message.message}</div>
            </div>
          )
        })}
      </div>
      <div className='relative shrink-0'>
        <textarea
          className='h-8 w-full resize-none overflow-hidden rounded-sm border border-gray-300 px-2 py-2.5 pr-13 align-top text-[10px] uppercase placeholder:text-gray-300'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Type your message here'
        />
        <ButtonWithAudio
          className='absolute top-1/2 right-2 -translate-y-1/2 px-1 text-xs'
          text='Send'
          bg='red'
          onClick={addMessage}
          disabled={message === ''}
        />
      </div>
    </div>
  )
}

export { SideChat }
