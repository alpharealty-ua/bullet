import { useState } from 'react'
import { IoLockClosed } from 'react-icons/io5'
import { PiArrowFatLeftFill, PiArrowFatRightFill } from 'react-icons/pi'

import { cn } from '@/lib/utils'
import { images } from '@/lib/constants'
import { Character } from './character'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'

export const CharacterSelector = ({
  label,
  characterImages,
  disabledImages,
  onSelect,
  defaultIndex = 0,
}: {
  label: string
  characterImages: string[]
  disabledImages: number[]
  onSelect: (index: number) => void
  defaultIndex?: number
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const changeIndex = (index: number) => {
    const newIndex =
      index < 0 ? characterImages.length - 1 : index % characterImages.length
    setActiveIndex(newIndex)
  }

  const handleClick = (index: number) => {
    const newIndex = selectedIndex === index ? -1 : index
    onSelect(newIndex)
    setSelectedIndex(newIndex)
  }

  return (
    <>
      <h3 className='text-center text-xl'>{label}</h3>
      <div className='flex h-[250px] items-center gap-2'>
        <button
          className='bg-red flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-xl text-white transition-all hover:scale-90 active:scale-75'
          onClick={() => changeIndex(activeIndex - 1)}
        >
          <PiArrowFatLeftFill />
        </button>
        <div className='relative flex h-full w-[250px] shrink-0 items-center justify-center'>
          {characterImages.map((_, i) => {
            const disabled = disabledImages.includes(i)

            return (
              <div
                key={i}
                className={cn(
                  'hidden h-full w-full items-center justify-center rounded-full border-4 bg-white bg-cover bg-center bg-no-repeat p-8',
                  i === activeIndex && 'flex',
                  i === selectedIndex && 'border-green bg-green/10',
                )}
                style={{ backgroundImage: `url(${images.texture})` }}
              >
                <Character
                  characterIndex={i}
                  className='animate-in fade-in zoom-in-150 h-full'
                />
                <button
                  key={i}
                  className={cn(
                    'absolute inset-0 cursor-pointer p-8 disabled:cursor-not-allowed',
                  )}
                  onClick={() => handleClick(i)}
                  disabled={disabled}
                ></button>
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
          onClick={() => changeIndex(activeIndex + 1)}
        >
          <PiArrowFatRightFill />
        </button>
      </div>
    </>
  )
}
