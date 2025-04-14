import { useState } from 'react'
import { IoLockClosed } from 'react-icons/io5'
import { PiArrowFatLeftFill, PiArrowFatRightFill } from 'react-icons/pi'

import { cn } from '@/lib/utils'
import { CharacterType, IMAGES } from '@/lib/constants'
import { Character } from '@/components/character'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { CharacterEntity } from '@/api/duel.api'

const CharacterSelector = ({
  label,
  characters,
  onSelect,
  defaultName,
}: {
  label: string
  characters: CharacterEntity[]
  defaultName: string
  onSelect: (character: CharacterEntity) => void
}) => {
  const [activeIndex, setActiveIndex] = useState(
    characters.findIndex((n) => n.id === defaultName) ?? 0,
  )
  const [type, setType] = useState<CharacterType>('front')
  const [showConfirm, setShowConfirm] = useState(false)

  const changeIndex = (index: number) => {
    const newIndex =
      index < 0 ? characters.length - 1 : index % characters.length
    setActiveIndex(newIndex)
    setShowConfirm(false)
    onSelect(characters[newIndex])
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

  const handleConfirmClick = () => {}

  const handleUnlockClick = () => setShowConfirm(true)

  const handleBackClick = () => setShowConfirm(false)

  return (
    <>
      <h3 className='text-center text-xl'>{label}</h3>
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
            const disabled = Boolean(character.price)
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
                          <div className='text-3xl'>$ {character.price}</div>
                          <ButtonWithAudio
                            as='button'
                            bg='primary'
                            text='Unlock'
                            onClick={handleUnlockClick}
                          />
                        </>
                      ) : (
                        <>
                          <h3 className='text-2xl'>Are you sure?</h3>
                          <div className='flex gap-2'>
                            <ButtonWithAudio
                              as='button'
                              bg='green'
                              text='Confirm'
                              className='text-base'
                              onClick={handleConfirmClick}
                            />
                            <ButtonWithAudio
                              as='button'
                              bg='red'
                              text='back'
                              className='text-base'
                              onClick={handleBackClick}
                            />
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
      <ButtonWithAudio
        as='button'
        bg='primary'
        text='flip'
        onClick={handleFlipClick}
      />
    </>
  )
}

export { CharacterSelector }
