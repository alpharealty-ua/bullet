import { useState } from 'react'

import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'

const characterImages = [images.duelcharacter1, images.duelcharacter2]

export const CharacterSelector = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  const changeIndex = (index: number) => {
    const newIndex =
      index < 0 ? characterImages.length - 1 : index % characterImages.length
    setActiveIndex(newIndex)
  }

  return (
    <>
      <h3>Choose your character</h3>
      <div className='flex h-[200px] items-center'>
        <button
          className='cursor-pointer border-25 border-r-30 border-l-0 border-[#ff0101] !border-t-transparent border-b-transparent transition-all hover:scale-90 active:scale-75'
          onClick={() => changeIndex(activeIndex - 1)}
        ></button>
        <div className='flex h-full w-[200px] shrink-0 items-center justify-center'>
          {characterImages.map((el, i) => (
            <div
              key={i}
              className={cn(
                'animate-in fade-in zoom-in-50 hidden h-full items-center',
                i === activeIndex && 'flex',
              )}
            >
              <img
                src={el}
                alt=''
                className='pointer-events-none max-h-full select-none'
              />
            </div>
          ))}
        </div>
        <button
          className='cursor-pointer border-25 border-r-0 border-l-30 border-[#ff0101] !border-t-transparent border-b-transparent transition-all hover:scale-90 active:scale-75'
          onClick={() => changeIndex(activeIndex - 1)}
        ></button>
      </div>
    </>
  )
}
