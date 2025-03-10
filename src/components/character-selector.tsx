import { useState } from 'react'
import { IoLockClosed } from 'react-icons/io5'
import { PiArrowFatLeftFill, PiArrowFatRightFill } from 'react-icons/pi'

import { cn } from '@/lib/utils'
import { CHARACTER_NAMES, CharacterType, IMAGES } from '@/lib/constants'
import { Character } from './character'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Button } from '@/components/ui/button'

const CharacterSelector = ({
  label,
  disabledImages,
  onSelect,
  defaultIndex = 0,
}: {
  label: string
  disabledImages: number[]
  onSelect: (index: number) => void
  defaultIndex?: number
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const [type, setType] = useState<CharacterType>('front')

  const changeIndex = (index: number) => {
    const newIndex =
      index < 0 ? CHARACTER_NAMES.length - 1 : index % CHARACTER_NAMES.length
    setActiveIndex(newIndex)
    onSelect(index)
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

  return (
    <>
      <h3 className='text-center text-xl'>{label}</h3>
      <div className='flex h-[250px] items-center gap-2'>
        <button
          className='bg-red flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-xl text-white transition-all hover:scale-90 active:scale-75'
          onMouseDown={handlePrevButtonClick}
        >
          <PiArrowFatLeftFill />
        </button>
        <div className='relative flex h-full w-[250px] shrink-0 items-center justify-center'>
          {CHARACTER_NAMES.map((name, i) => {
            const disabled = disabledImages.includes(i)
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
                <button
                  key={i}
                  className={cn(
                    'absolute inset-0 flex items-center justify-center rounded-[inherit] border-4 p-10 transition-all disabled:cursor-not-allowed',
                  )}
                  disabled={disabled}
                >
                  <Character
                    characterName={name}
                    type={type}
                    className='animate-in fade-in zoom-in-150 h-full'
                  />
                </button>
                {disabled && (
                  <div className='animate-in fade-in fill-mode-both absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-full bg-black/30 text-7xl text-white duration-500'>
                    <IoLockClosed />
                    <ButtonWithAudio bg='primary' text='Unlock' />
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <button
          className='bg-red flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-xl text-white transition-all hover:scale-90 active:scale-75'
          onMouseDown={handleNextButtonClick}
        >
          <PiArrowFatRightFill />
        </button>
      </div>
      <Button bg='primary' text='flip' onClick={handleFlipClick} />
    </>
  )
}

export { CharacterSelector }
