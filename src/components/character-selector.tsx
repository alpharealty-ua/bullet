import { useState } from 'react'
import { IoLockClosed } from 'react-icons/io5'
import { PiArrowFatLeftFill, PiArrowFatRightFill } from 'react-icons/pi'

import { cn } from '@/lib/utils'
import { Character as CharacterType, images } from '@/lib/constants'
import { Character } from './character'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'

const CharacterSelector = ({
  label,
  characterList,
  disabledImages,
  onSelect,
  defaultIndex = 0,
}: {
  label: string
  characterList: CharacterType[]
  disabledImages: number[]
  onSelect: (index: number) => void
  defaultIndex?: number
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex)

  const handleArrowClick = (index: number) => {
    const newIndex =
      index < 0 ? characterList.length - 1 : index % characterList.length
    setActiveIndex(newIndex)
    const disabled = disabledImages.includes(index)
    if (!disabled) {
      setSelectedIndex(newIndex)
      onSelect(newIndex)
    }
  }

  return (
    <>
      <h3 className='text-center text-xl'>{label}</h3>
      <div className='flex h-[250px] items-center gap-2'>
        <button
          className='bg-red flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-xl text-white transition-all hover:scale-90 active:scale-75'
          onMouseDown={() => handleArrowClick(activeIndex - 1)}
        >
          <PiArrowFatLeftFill />
        </button>
        <div className='relative flex h-full w-[250px] shrink-0 items-center justify-center'>
          {characterList.map((character, i) => {
            const disabled = disabledImages.includes(i)
            const selected = i === selectedIndex
            const active = i === activeIndex

            return (
              <div
                key={i}
                className={cn(
                  'hidden h-full w-full items-center justify-center rounded-full bg-white bg-cover bg-center bg-no-repeat p-8',
                  active && 'flex',
                )}
                style={{ backgroundImage: `url(${images.texture})` }}
              >
                <button
                  key={i}
                  className={cn(
                    'absolute inset-0 flex cursor-pointer items-center justify-center rounded-[inherit] border-4 p-10 transition-all disabled:cursor-not-allowed',
                    selected && 'bg-green/10 border-green',
                  )}
                  disabled={disabled}
                >
                  <Character
                    character={character}
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
          onMouseDown={() => handleArrowClick(activeIndex + 1)}
        >
          <PiArrowFatRightFill />
        </button>
      </div>
    </>
  )
}

export { CharacterSelector }
