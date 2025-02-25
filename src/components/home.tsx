import { useState } from 'react'
import { useNavigate } from 'react-router'

import { useCustomModal } from '@/hooks/use-custom-modal'
import { useAppContext } from '@/context/use-app-context'
import { images, CHARACTER_IMAGES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Logo } from './logo'
import { Rules } from './rules'
import { CharacterSelector } from './character-selector'

const Home = () => {
  const { game, characterIndex, setCharacterIndex } = useAppContext()
  const nagigate = useNavigate()
  const modal = useCustomModal()
  const [showDuelCover, setShowDuelCover] = useState(false)

  const handleStartButton = async () => {
    game.newGame('single')
    nagigate('/single')
  }

  const handleDuelButton = async () => {
    setShowDuelCover(true)
  }

  const handleStartDuelButton = async () => {
    game.newGame('duel')
    nagigate('/duel')
  }

  const handleWatchButton = async () => {
    game.newGame('duel')
    nagigate('/watch')
  }

  const handleGameRules = async () => {
    modal.show({
      contentSlot: <Rules />,
    })
  }

  const handleSelectCharacter = (index: number) => {
    setCharacterIndex(index)
  }

  return (
    <div
      className={cn(
        'custom-scroll absolute inset-0 z-50 flex flex-col items-center justify-center gap-10 overflow-auto bg-cover bg-[right_center] px-3 py-12',
      )}
      style={{ backgroundImage: `url(${images.wrapper})` }}
    >
      <Logo to='/' size='xl' text={showDuelCover ? 'Duel' : ''} />
      <div className='flex flex-col items-center justify-center gap-6'>
        {!showDuelCover ? (
          <>
            <ButtonWithAudio
              image='duel'
              className='w-30'
              onClick={handleDuelButton}
            />
            <ButtonWithAudio
              image='solo'
              className='w-30'
              onClick={handleStartButton}
            />
            <ButtonWithAudio
              image='gamerules'
              className='w-24'
              onClick={handleGameRules}
            />
          </>
        ) : (
          <>
            <div className='flex gap-6'>
              <ButtonWithAudio
                image='play'
                className='w-30'
                onClick={handleStartDuelButton}
              />
              <ButtonWithAudio
                image='watch'
                className='w-30 text-2xl'
                onClick={handleWatchButton}
              />
            </div>
            <CharacterSelector
              label='Choose your character'
              images={CHARACTER_IMAGES}
              onSelect={handleSelectCharacter}
              defaultIndex={characterIndex}
            />
          </>
        )}
      </div>
    </div>
  )
}

export { Home }
