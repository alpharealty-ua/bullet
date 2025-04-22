import React, { useCallback, useState } from 'react'

import { useUserCharacters } from '@/api/character.api'
import { ROUTES } from '@/routes/path'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { CharacterSelector } from '@/components/character-selector'
import { Loading } from '@/components/loading'

const GameSelectorPage = ({ format }: { format: 'solo' | 'duel' }) => {
  const { data: characters, isLoading, isSuccess } = useUserCharacters()
  const [selected, setSelected] = useState(false)
  const isDuel = format === 'duel'
  const isSolo = format === 'solo'
  const isDisabled = isDuel && !selected

  const handleSelectCharacter = useCallback((selected: boolean) => {
    setSelected(selected)
  }, [])

  const handleButtonClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    if (isDisabled) {
      event.preventDefault()
    }
  }

  return (
    <>
      <main className='flex grow flex-col items-center justify-center gap-6 py-8'>
        <div className='flex gap-6'>
          <ButtonWithAudio
            as='link'
            to={isSolo ? ROUTES.solo.play : ROUTES.duel.enterArena}
            onClick={handleButtonClick}
            className='w-30'
            image='play'
            data-disabled={isDisabled}
          />
          <ButtonWithAudio
            as='link'
            to={isSolo ? ROUTES.solo.watch : ROUTES.duel.watch}
            onClick={handleButtonClick}
            className='w-30'
            image='watch'
            data-disabled={isDisabled}
          />
        </div>
        {isDuel &&
          (isLoading || !isSuccess ? (
            <Loading />
          ) : (
            <CharacterSelector
              characters={characters}
              onSelect={handleSelectCharacter}
            />
          ))}
      </main>
    </>
  )
}

export { GameSelectorPage }
