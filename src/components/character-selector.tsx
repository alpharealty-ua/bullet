import { useState } from 'react'
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa'

import { cn } from '@/lib/utils'

export const CharacterSelector = ({
  label,
  images,
  onSelect,
  defaultIndex = 0,
}: {
  label: string
  images: string[]
  onSelect: (index: number) => void
  defaultIndex?: number
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)

  const changeIndex = (index: number) => {
    const newIndex = index < 0 ? images.length - 1 : index % images.length
    setActiveIndex(newIndex)
    onSelect(newIndex)
  }

  return (
    <>
      <h3>{label}</h3>
      <div className='flex h-[200px] items-center'>
        <button
          className='text-red cursor-pointer text-4xl transition-all hover:scale-90 active:scale-75'
          onClick={() => changeIndex(activeIndex - 1)}
        >
          <FaArrowAltCircleLeft />
        </button>
        <div className='flex h-full w-[200px] shrink-0 items-center justify-center'>
          {images.map((el, i) => (
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
          className='text-red cursor-pointer text-4xl transition-all hover:scale-90 active:scale-75'
          onClick={() => changeIndex(activeIndex + 1)}
        >
          <FaArrowAltCircleRight />
        </button>
      </div>
    </>
  )
}
