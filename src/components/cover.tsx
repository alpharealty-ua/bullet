import { useState } from 'react'

import { useCustomModal } from '@/hooks/use-custom-modal'
import { useAppContext } from '@/context/use-app-context'
import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Logo } from './logo'
import { Rules } from './rules'
import { CharacterSelector } from './character-selector'

const Cover = () => {
  const { game, mouseClick } = useAppContext()
  const modal = useCustomModal()
  const [showDuelCover, setShowDuelCover] = useState(true)

  const handleStartButton = async () => {
    await mouseClick()
    game.newGame('single')
  }

  const handleDuelButton = async () => {
    await mouseClick()
    setShowDuelCover(true)
  }

  const handleWatchButton = async () => {
    await mouseClick()
    game.newGame('duel')
  }

  const handleGameRules = async () => {
    await mouseClick()
    modal.show({
      contentSlot: <Rules />,
    })
  }

  return (
    <div
      className={cn(
        'custom-scroll absolute inset-0 z-50 flex flex-col items-center justify-center gap-10 overflow-auto bg-cover bg-[right_center] px-3 py-12',
      )}
      style={{ backgroundImage: `url(${images.wrapper})` }}
    >
      <div className='relative inline-flex'>
        <Logo size='3xl' />
        {showDuelCover && (
          <div className='animate-in fade-in zoom-in-50 absolute top-full left-full -mt-8 -ml-8 text-4xl text-[#ff0101] italic duration-500'>
            duel
          </div>
        )}
      </div>
      <div className='flex flex-col items-center justify-center gap-6'>
        {!showDuelCover ? (
          <>
            <Button image='play' className='w-30' onClick={handleStartButton} />
            <Button image='duel' className='w-30' onClick={handleDuelButton} />
            <Button
              image='gamerules'
              className='w-24'
              onClick={handleGameRules}
            />
          </>
        ) : (
          <>
            <div className='flex gap-6'>
              <Button
                image='play'
                className='w-30'
                onClick={handleStartButton}
              />
              <Button
                image='watch'
                className='w-30 text-2xl'
                onClick={handleWatchButton}
              />
            </div>
            <CharacterSelector />
          </>
        )}
      </div>
    </div>
  )
}

export { Cover }
