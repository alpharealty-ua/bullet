import { useEffect, useRef, useState } from 'react'

import { Language, LANGUAGE_LIST } from '@/lib/constants'
import { mockRooms } from '@/lib/mocks'
import { cn } from '@/lib/utils'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'

const DEFAULT_ROOM = 'usa'

const rooms = mockRooms

const SideChat = ({
  languageProps: { className, ...languageProps } = {},
}: {
  languageProps?: React.HtmlHTMLAttributes<HTMLDivElement>
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [selectedLanguage, setSelectedLanguage] =
    useState<Language>(DEFAULT_ROOM)
  const [messages, setMessages] = useState<Message[]>([])
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

  const handleChangeLanguage = (language: Language) => {
    setSelectedLanguage(language)
  }

  useEffect(() => {
    setMessages(rooms[selectedLanguage])
  }, [selectedLanguage])

  useEffect(() => {
    scorllToBottom()
  }, [messages])

  return (
    <div
      ref={wrapperRef}
      className='relative flex h-full grow-1 flex-col justify-between gap-2'
    >
      <div
        className={cn('absolute top-0 right-0 flex flex-col gap-1', className)}
        {...languageProps}
      >
        {LANGUAGE_LIST.map(({ language, flag }, i) => (
          <div
            key={i}
            className={cn(
              'aspect-[10/7] w-7 cursor-pointer border bg-gray-100 bg-cover bg-center bg-no-repeat transition-all',
              selectedLanguage === language && 'border-white',
            )}
            onClick={() => handleChangeLanguage(language)}
            style={{ backgroundImage: `url(${flag})` }}
          ></div>
        ))}
      </div>
      <div
        className='custom-scroll flex grow flex-col gap-1 overflow-auto scroll-smooth'
        data-messages
      >
        {messages.map((message) => {
          return (
            <div key={message.id} className='flex flex-col gap-1 text-[10px]'>
              <div className='font-bold'>{message.user}:</div>
              <div className='font-verdana normal-case'>{message.message}</div>
            </div>
          )
        })}
      </div>
      <div className='relative shrink-0'>
        <textarea
          className='font-verdana h-8 w-full resize-none overflow-hidden rounded-sm border border-gray-300 px-2 py-2.5 pr-13 align-top text-[10px] uppercase placeholder:text-gray-300'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Type your message here'
        />
        <ButtonWithAudio
          as='button'
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
