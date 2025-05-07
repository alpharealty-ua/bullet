import { useEffect, useState } from 'react'
import { IoLockClosed } from 'react-icons/io5'
import { PiArrowFatLeftFill, PiArrowFatRightFill } from 'react-icons/pi'

import { usePurchaseCharacter, useUserCharacters } from '@/api/character.api'
import { useGameStore } from '@/store/game.store'
import { useSettingsStore } from '@/store/settings.store'
import { cn } from '@/lib/utils'
import { CharacterType, IMAGES } from '@/lib/constants'
import { Character } from '@/components/duel/character'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Notification } from '@/components/ui/notification'
import { Loading } from '@/components/ui/loading'

interface CharacterSelectorProps {
  onSelect: (selected: boolean) => void
}

const CharacterSelector = ({ onSelect }: CharacterSelectorProps) => {
  const { data: characters, isLoading, isSuccess } = useUserCharacters()
  const {
    mutate: purchaseCharacterMutation,
    isPending: isPurchasing,
    error: isPurchaseError,
    isSuccess: isPurchaseSuccess,
  } = usePurchaseCharacter()
  const setCharacterName = useGameStore(
    ({ setCharacterName }) => setCharacterName,
  )
  const characterName = useGameStore(({ characterName }) => characterName)
  const playSound = useSettingsStore(({ playSound }) => playSound)
  const [activeIndex, setActiveIndex] = useState(0)
  const [type, setType] = useState<CharacterType>('front')
  const [showConfirm, setShowConfirm] = useState(false)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    if (!characters) {
      return
    }

    const activeIndex = characters.findIndex((n) => n.id === characterName)
    setActiveIndex(activeIndex)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  useEffect(() => {
    if (!characters) {
      return
    }

    const selected = Boolean(
      characters.find((_, index) => index === activeIndex)?.purchased,
    )
    onSelect(selected)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSelect, characters])

  if (isLoading || !isSuccess) {
    return <Loading />
  }

  const changeIndex = (index: number) => {
    const newIndex =
      index < 0 ? characters.length - 1 : index % characters.length
    const character = characters[newIndex]

    setActiveIndex(newIndex)
    setShowConfirm(false)

    const selected = character.purchased

    onSelect(selected)
    if (selected) {
      setCharacterName(character.id)
    }
  }

  const handlePrevButtonClick = () => {
    changeIndex(activeIndex - 1)
  }

  const handleNextButtonClick = () => {
    changeIndex(activeIndex + 1)
  }

  const handleFlipClick = () => {
    setType(type === 'front' ? 'back' : 'front')
  }

  const handlePurchaseClick = async () => {
    const characterName = characters[activeIndex].id
    purchaseCharacterMutation(characterName, {
      onSuccess: () => {
        playSound('holy')
        onSelect(true)
      },
      onError: () => {},
      onSettled: () => {
        setShowConfirm(false)
        setShowResult(true)
        setTimeout(() => setShowResult(false), 1500)
      },
    })
  }

  const handleUnlockClick = () => setShowConfirm(true)

  const handleBackClick = () => setShowConfirm(false)

  return (
    <>
      <h3 className='text-center text-xl'>Choose your character</h3>
      <div className='flex h-60 items-center gap-2'>
        <ButtonWithAudio
          as='button'
          bg='red'
          className='h-8 w-8 rounded-full border-none p-0 text-xl'
          onClick={handlePrevButtonClick}
        >
          <PiArrowFatLeftFill />
        </ButtonWithAudio>
        <div className='relative flex h-full w-60 shrink-0 items-center justify-center'>
          {characters.map((character, i) => {
            const disabled = !character.purchased
            const active = i === activeIndex

            return (
              <div
                key={i}
                className={cn(
                  'hidden h-full w-full items-center justify-center rounded-full bg-white bg-cover bg-center bg-no-repeat p-8 duration-500',
                  active && 'flex',
                )}
                style={{ backgroundImage: `url(${IMAGES.texture})` }}
              >
                <div
                  key={i}
                  className={cn(
                    'absolute inset-0 flex items-center justify-center rounded-[inherit] border-4 p-10 transition-all disabled:cursor-not-allowed',
                  )}
                >
                  <Character
                    name={character.id}
                    type={type}
                    className='animate-in fade-in zoom-in-150 h-full'
                  />
                </div>
                {disabled && (
                  <div
                    className={cn(
                      'absolute inset-0 flex flex-col items-center justify-center gap-2.5 rounded-full bg-black/30 text-center text-white',
                      'animate-in fade-in fill-mode-both duration-500',
                    )}
                  >
                    <IoLockClosed className='text-7xl drop-shadow-2xl' />
                    <div className='flex min-h-25 flex-col gap-2.5'>
                      {!showConfirm ? (
                        <>
                          <div className='text-3xl'>
                            $ {character.formattedPrice}
                          </div>
                          <ButtonWithAudio
                            as='button'
                            bg='primary'
                            onClick={handleUnlockClick}
                          >
                            Unlock{' '}
                          </ButtonWithAudio>
                        </>
                      ) : (
                        <>
                          <h3 className='text-2xl'>Are you sure?</h3>
                          <div className='flex gap-2'>
                            <ButtonWithAudio
                              as='button'
                              bg='green'
                              className='text-base'
                              onClick={handlePurchaseClick}
                            >
                              {isPurchasing ? 'Purchasing...' : 'Purchase'}
                            </ButtonWithAudio>
                            <ButtonWithAudio
                              as='button'
                              bg='red'
                              className='text-base'
                              onClick={handleBackClick}
                            >
                              back
                            </ButtonWithAudio>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <ButtonWithAudio
          as='button'
          bg='red'
          className='h-8 w-8 rounded-full border-none p-0 text-xl'
          onClick={handleNextButtonClick}
        >
          <PiArrowFatRightFill />
        </ButtonWithAudio>
      </div>
      <ButtonWithAudio as='button' bg='primary' onClick={handleFlipClick}>
        flip
      </ButtonWithAudio>
      <>
        <Notification
          type='error'
          message={showResult ? isPurchaseError?.message : ''}
        />
        <Notification
          type='success'
          message={
            showResult && isPurchaseSuccess
              ? 'You have purchased a character'
              : ''
          }
        />
      </>
    </>
  )
}

export { CharacterSelector }
