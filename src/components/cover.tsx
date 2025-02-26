import { useState } from 'react'
import { useNavigate } from 'react-router'

import { useAppContext } from '@/context/use-app-context'
import { CHARACTER_IMAGES } from '@/lib/constants'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Logo } from './logo'
import { CharacterSelector } from './character-selector'

// TODO: TEMPORARY SOLUTION
const disabledImages = [1]

const Cover = ({ format }: { format: 'solo' | 'duel' }) => {
  const { characterIndex, setCharacterIndex } = useAppContext()
  const [characterSelected, setCharacterSelected] = useState(false)
  const navigate = useNavigate()
  const isDuel = format === 'duel'
  const isSolo = format === 'solo'

  const handlePlayButton = async () => {
    navigate(isSolo ? '/solo/play' : '/duel/play')
  }

  const handleWatchButton = async () => {
    navigate(isSolo ? '/solo/watch' : '/duel/watch')
  }

  const handleSelectCharacter = (index: number) => {
    setCharacterIndex(index)
    setCharacterSelected(index !== -1)
  }

  return (
    <div className='relative flex grow-1 flex-col items-center justify-center gap-10 bg-no-repeat px-3 py-12'>
      <Logo to='/' size='xl' text={isDuel ? 'Duel' : 'Solo'} />
      <div className='flex flex-col items-center justify-center gap-6'>
        <div className='flex gap-6'>
          <ButtonWithAudio
            image='play'
            className='w-30'
            onClick={handlePlayButton}
            disabled={isDuel && !characterSelected}
          />
          <ButtonWithAudio
            image='watch'
            className='w-30 text-2xl'
            onClick={handleWatchButton}
            disabled={isDuel && !characterSelected}
          />
        </div>
        {isDuel && (
          <CharacterSelector
            label='Choose your character'
            characterImages={CHARACTER_IMAGES}
            disabledImages={disabledImages}
            onSelect={handleSelectCharacter}
            defaultIndex={characterIndex}
          />
        )}
      </div>
    </div>
  )
}

export { Cover }
