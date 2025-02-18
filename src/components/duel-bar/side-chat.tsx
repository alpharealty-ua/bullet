import { useState } from 'react'
import { Button } from '../ui/button'

const initMessages = [
  {
    id: '1',
    author: 'WallStreetWhale',
    message: "Fresh blood at the table. Let's see what you've got.",
  },
]

const SideChat = () => {
  const [messages, setMessages] = useState(initMessages)
  const [message, setMessage] = useState('')

  const addMessage = () => {
    const newMessage = { id: String(Date.now()), author: 'Player', message }
    setMessages((p) => [...p, newMessage])
    setMessage('')
  }

  return (
    <div className='flex h-full flex-col justify-between px-4'>
      <div>
        {messages.map((message, i) => {
          return (
            <div key={message.id} className='flex gap-1 text-[10px]'>
              <div>{message.author}:</div>
              <div> {message.message}</div>
            </div>
          )
        })}
      </div>
      <div>
        <input
          type='text'
          className='border'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button text='send' onClick={addMessage} disabled={message === ''} />
      </div>
    </div>
  )
}

export { SideChat }
