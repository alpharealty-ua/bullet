import { useState } from 'react'

import { useGameStore } from '@/store/game.store'
import { ROUTES } from '@/routes/path'
import { cn } from '@/lib/utils'
import { CHARACTER_NAMES, DISABLED_CHARACTER_NAMES } from '@/lib/constants'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Logo } from '@/components/logo'
import { CharacterSelector } from '@/components/character-selector'
import { PageWrapper } from '@/components/page-wrapper'

const GameSelectorPage = ({ format }: { format: 'solo' | 'duel' }) => {
  const setCharacterName = useGameStore(
    ({ setCharacterName }) => setCharacterName,
  )
  const characterName = useGameStore(({ characterName }) => characterName)
  const [disabled, setDisabled] = useState(false)
  const isDuel = format === 'duel'
  const isSolo = format === 'solo'

  const handleSelectCharacter = (index: number) => {
    const characterName = CHARACTER_NAMES[index]
    const disabled = DISABLED_CHARACTER_NAMES.includes(characterName)
    setDisabled(disabled)

    if (!disabled) {
      setCharacterName(characterName)
    }
  }

  const handleButtonClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    if (disabled) {
      event.preventDefault()
    }
  }

  return (
    <PageWrapper>
      <Logo as='link' to='/' size='xl' text={isDuel ? 'Duel' : 'Solo'} />
      <div className='flex flex-col items-center justify-center gap-6'>
        <div className='flex gap-6'>
          <ButtonWithAudio
            as='link'
            to={isSolo ? ROUTES.solo.play : ROUTES.duel.play}
            onClick={handleButtonClick}
            className={cn('w-30', disabled && 'cursor-not-allowed')}
            image='play'
          />
          <ButtonWithAudio
            as='link'
            to={isSolo ? ROUTES.solo.watch : ROUTES.duel.watch}
            onClick={handleButtonClick}
            className={cn('w-30', disabled && 'cursor-not-allowed')}
            image='watch'
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
    </PageWrapper>
  )
}

export { GameSelectorPage }
