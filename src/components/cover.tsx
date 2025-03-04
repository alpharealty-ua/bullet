import { useNavigate } from 'react-router'

import { useDuelStore } from '@/store/duel.store'
import { ROUTES } from '@/routes/path'
import { CharacterName } from '@/lib/constants'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Logo } from './logo'
import { CharacterSelector } from './character-selector'

// TODO: TEMPORARY SOLUTION
const disabledImages = [1, 2]

const Cover = ({ format }: { format: 'solo' | 'duel' }) => {
  const setCharacterName = useDuelStore(
    ({ setCharacterName }) => setCharacterName,
  )
  const navigate = useNavigate()
  const isDuel = format === 'duel'
  const isSolo = format === 'solo'

  const handlePlayButton = async () => {
    navigate(isSolo ? ROUTES.solo.play : ROUTES.duel.play)
  }

  const handleWatchButton = async () => {
    navigate(isSolo ? ROUTES.solo.watch : ROUTES.duel.watch)
  }

  const handleSelectCharacter = (name: CharacterName) => {
    setCharacterName(name)
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
          />
          <ButtonWithAudio
            image='watch'
            className='w-30 text-2xl'
            onClick={handleWatchButton}
          />
        </div>
        {isDuel && (
          <CharacterSelector
            label='Choose your character'
            disabledImages={disabledImages}
            onSelect={handleSelectCharacter}
          />
        )}
      </div>
    </div>
  )
}

export { Cover }
