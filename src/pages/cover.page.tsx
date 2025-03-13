import { useState } from 'react'
import { useNavigate } from 'react-router'

import { useGameStore } from '@/store/game.store'
import { ROUTES } from '@/routes/path'
import { CHARACTER_NAMES, DISABLED_CHARACTER_NAMES } from '@/lib/constants'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Logo } from '@/components/logo'
import { CharacterSelector } from '@/components/character-selector'

const CoverPage = ({ format }: { format: 'solo' | 'duel' }) => {
  const setCharacterName = useGameStore(
    ({ setCharacterName }) => setCharacterName,
  )
  const characterName = useGameStore(({ characterName }) => characterName)
  const navigate = useNavigate()
  const [disabled, setDisabled] = useState(false)
  const isDuel = format === 'duel'
  const isSolo = format === 'solo'

  const handlePlayButton = async () => {
    navigate(isSolo ? ROUTES.solo.play : ROUTES.duel.play)
  }

  const handleWatchButton = async () => {
    navigate(isSolo ? ROUTES.solo.watch : ROUTES.duel.watch)
  }

  const handleSelectCharacter = (index: number) => {
    const characterName = CHARACTER_NAMES[index]
    const disabled = DISABLED_CHARACTER_NAMES.includes(characterName)
    setDisabled(disabled)

    if (!disabled) {
      setCharacterName(characterName)
    }
  }

  return (
    <div className='relative flex grow-1 flex-col items-center justify-center gap-10 bg-no-repeat px-3 py-12'>
      <Logo as='link' to='/' size='xl' text={isDuel ? 'Duel' : 'Solo'} />
      <div className='flex flex-col items-center justify-center gap-6'>
        <div className='flex gap-6'>
          <ButtonWithAudio
            image='play'
            className='w-30'
            disabled={disabled}
            onClick={handlePlayButton}
          />
          <ButtonWithAudio
            image='watch'
            className='w-30 text-2xl'
            disabled={disabled}
            onClick={handleWatchButton}
          />
        </div>
        {isDuel && (
          <CharacterSelector
            label='Choose your character'
            characterNames={CHARACTER_NAMES}
            disabledCharacter={DISABLED_CHARACTER_NAMES}
            onSelect={handleSelectCharacter}
            defaultName={characterName}
          />
        )}
      </div>
    </div>
  )
}

export { CoverPage }
