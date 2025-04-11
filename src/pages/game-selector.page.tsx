import React, { useState } from 'react'

import { CharacterEntity, useCharacters } from '@/api/duel.api'
import { useGameStore } from '@/store/game.store'
import { ROUTES } from '@/routes/path'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { CharacterSelector } from '@/components/character-selector'
import { Loading } from '@/components/loading'

const GameSelectorPage = ({ format }: { format: 'solo' | 'duel' }) => {
  const { data: characters, isLoading, isSuccess } = useCharacters()
  const setCharacterName = useGameStore(
    ({ setCharacterName }) => setCharacterName,
  )
  const characterName = useGameStore(({ characterName }) => characterName)
  const [disabled, setDisabled] = useState(false)
  const isDuel = format === 'duel'
  const isSolo = format === 'solo'

  const handleSelectCharacter = (character: CharacterEntity) => {
    const characterName = character.id
    const disabled = character.price !== 0
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
    <>
      <div className='flex grow flex-col items-center justify-center gap-6 py-8'>
        <div className='flex gap-6'>
          <ButtonWithAudio
            as='link'
            to={isSolo ? ROUTES.solo.play : ROUTES.duel.play}
            onClick={handleButtonClick}
            className='w-30'
            image='play'
            data-disabled={disabled}
          />
          <ButtonWithAudio
            as='link'
            to={isSolo ? ROUTES.solo.watch : ROUTES.duel.watch}
            onClick={handleButtonClick}
            className='w-30'
            image='watch'
            data-disabled={disabled}
          />
        </div>
        {isDuel &&
          (isLoading || !isSuccess ? (
            <Loading />
          ) : (
            <CharacterSelector
              label='Choose your character'
              characters={characters}
              onSelect={handleSelectCharacter}
              defaultName={characterName}
            />
          ))}
      </div>
    </>
  )
}

export { GameSelectorPage }
