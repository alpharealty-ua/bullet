import { useState } from 'react'
import classNames from 'classnames'

import { CloseButton } from './close-button'
import { Logo } from './logo'
import { images } from '@/lib/constants'

const Rules = ({
  onStartGame,
  onClose,
}: {
  onStartGame: () => void
  onClose: () => void
}) => {
  const [isOpen, setIsOpen] = useState(true)

  const handleStartGame = () => {
    setIsOpen(false)
    onStartGame()
  }

  const handleClose = () => {
    setIsOpen(false)
    onClose()
  }

  return (
    <div
      className={classNames(
        'fill-mode-both absolute inset-0 z-50 flex flex-col gap-12 px-3 py-12 duration-200',
        isOpen
          ? 'animate-in fade-in-0 zoom-in-95'
          : 'animate-out fade-out-0 zoom-out-95',
      )}
    >
      <div className='flex items-center justify-between'>
        <Logo size='lg' />
        <CloseButton onClick={handleClose} />
      </div>
      <div className='flex flex-col gap-4'>
        <h3 className='text-3xl font-bold'>Game rules</h3>
        <ol className='flex list-decimal flex-col gap-3 pl-10'>
          <li className='text-sm marker:text-2xl marker:font-bold marker:text-[#FF0000] marker:italic'>
            Lorem ipsum dolor sit amet consectetur. Tempor tincidunt commodo
            dignissim odio mi. Egestas condimentum elit nulla augue eget
            tincidunt.
          </li>
          <li className='text-sm marker:text-2xl marker:font-bold marker:text-[#FF0000] marker:italic'>
            Tellus eget molestie auctor sed. Adipiscing mollis lectus erat velit
            pharetra turpis cras leo. Convallis urna enim phasellus sed tortor
            arcu sollicitudin leo.
          </li>
          <li className='text-sm marker:text-2xl marker:font-bold marker:text-[#FF0000] marker:italic'>
            Donec volutpat amet habitant venenatis amet non facilisi nisl
            accumsan. Augue enim interdum est convallis diam donec.
          </li>
          <li className='text-sm marker:text-2xl marker:font-bold marker:text-[#FF0000] marker:italic'>
            Donec volutpat amet habitant venenatis amet non facilisi nisl
            accumsan. Augue enim interdum est convallis diam donec.
          </li>
        </ol>
      </div>
      <div className='text-center'>
        {/* TODO: REMOVE LATER */}
        <button
          className='relative hidden transition-transform active:scale-75 disabled:scale-100 disabled:cursor-not-allowed'
          onClick={handleStartGame}
        >
          <span className='absolute inset-0 inline-flex cursor-pointer items-center justify-center text-2xl font-bold'>
            Start the Game
          </span>
          <svg width='283' height='76' viewBox='0 0 283 76' fill='none'>
            <path
              d='M2 4H274.635L271.975 72L7.31971 69.5L2 4Z'
              fill='#FF9B2A'
            />
            <path
              d='M3.9165 2.99121C92.8331 2.99121 181.777 3.32183 270.71 3.32183'
              stroke='#010101'
              strokeWidth='3'
              strokeLinecap='round'
            />
            <path
              d='M2 70.1064C66.7996 70.1064 131.686 69.7845 196.477 70.1432C224.878 70.3004 252.707 72.7513 281 72.7513'
              stroke='#010101'
              strokeWidth='3'
              strokeLinecap='round'
            />
            <path
              d='M274.196 4.31445C271.539 26.64 270.709 48.7701 270.709 71.0989'
              stroke='#010101'
              strokeWidth='3'
              strokeLinecap='round'
            />
            <path
              d='M2.17705 2C2.17705 12.8361 2.01187 23.6745 2.17705 34.5106C2.24502 38.9693 4.11033 43.3621 4.59893 47.8087C5.72803 58.0844 4.79268 63.4157 4.79268 73.7029'
              stroke='#010101'
              strokeWidth='3'
              strokeLinecap='round'
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export { Rules }
