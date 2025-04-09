import { useState } from 'react'
import { Link } from 'react-router'
import { FaArrowLeft } from 'react-icons/fa'

import { CharacterEntity, useCharacters } from '@/api/duel.api'
import { useGameStore } from '@/store/game.store'
import { ROUTES } from '@/routes/path'
import { cn } from '@/lib/utils'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Logo } from '@/components/logo'
import { CharacterSelector } from '@/components/character-selector'
import { PageWrapper } from '@/components/page-wrapper'
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
    <PageWrapper>
      {/* TODO: EXTRACTED TO COMPONENT / THE SAME LEADERBOARD PAGE  */}
      <header className='flex items-center justify-center gap-4 px-8'>
        <Link to={ROUTES.root} className='flex w-0 justify-end'>
          <div className='w-8'>
            <FaArrowLeft className='text-red cursor-pointer text-3xl transition-all hover:text-black' />
          </div>
        </Link>
        <Logo
          as='link'
          to={ROUTES.root}
          size='xl'
          text={isDuel ? 'Duel' : 'Solo'}
        />
      </header>
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
    </PageWrapper>
  )
}

export { GameSelectorPage }
