import { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'

const UTC = Date.now()

const initMessages = [
  {
    author: 'WallStreetWhale',
    message: "Fresh blood at the table. Let's see what you've got.",
  },
  {
    author: 'WallStreetWhale',
    message: "Fresh blood at the table. Let's see what you've got.",
  },
  {
    author: 'WallStreetWhale',
    message: "Fresh blood at the table. Let's see what you've got.",
  },
  {
    author: 'WallStreetWhale',
    message: "Fresh blood at the table. Let's see what you've got.",
  },
  {
    author: 'WallStreetWhale',
    message: "Fresh blood at the table. Let's see what you've got.",
  },
  {
    author: 'WallStreetWhale',
    message: "Fresh blood at the table. Let's see what you've got.",
  },
  {
    author: 'WallStreetWhale',
    message: "Fresh blood at the table. Let's see what you've got.",
  },
  {
    author: 'WallStreetWhale',
    message: "Fresh blood at the table. Let's see what you've got.",
  },
  {
    author: 'WallStreetWhale',
    message: "Fresh blood at the table. Let's see what you've got.",
  },
  {
    author: 'WallStreetWhale',
    message: "Fresh blood at the table. Let's see what you've got.",
  },
  {
    author: 'WallStreetWhale',
    message: "Fresh blood at the table. Let's see what you've got.",
  },
  {
    author: 'WallStreetWhale',
    message: "Fresh blood at the table. Let's see what you've got.",
  },
  {
    author: 'WallStreetWhale',
    message: "Fresh blood at the table. Let's see what you've got.",
  },
  {
    author: 'WallStreetWhale',
    message: "Fresh blood at the table. Let's see what you've got.",
  },
].map((m, i) => ({ id: String(UTC + i), ...m }))

const SideChat = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState(initMessages)
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
    const newMessage = { id: String(Date.now()), author: 'Player', message }
    setMessages((p) => [...p, newMessage])
    setMessage('')
  }

  useEffect(() => {
    scorllToBottom()
  }, [messages])

  return (
    <div
      ref={wrapperRef}
      className='flex h-full flex-col justify-between gap-2 px-4'
    >
      <div
        className='custom-scroll flex grow flex-col gap-1 overflow-auto scroll-smooth'
        data-messages
      >
        {messages.map((message) => {
          return (
            <div key={message.id} className='flex gap-1 text-[10px]'>
              <div>{message.author}:</div>
              <div> {message.message}</div>
            </div>
          )
        })}
      </div>
      <div className='relative shrink-0'>
        <textarea
          className='h-12 w-full resize-none rounded-sm border border-gray-300 p-2 pr-22 align-top uppercase placeholder:text-gray-300'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Type your message here'
        />
        <Button
          className='absolute top-1/2 right-2 -translate-y-1/2'
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
