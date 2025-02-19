import { useState } from 'react'

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
          className='cursor-pointer border-25 border-r-30 border-l-0 border-[#ff0101] border-t-transparent border-b-transparent transition-all hover:scale-90 active:scale-75'
          onClick={() => changeIndex(activeIndex - 1)}
        ></button>
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
          className='cursor-pointer border-25 border-r-0 border-l-30 border-[#ff0101] border-t-transparent border-b-transparent transition-all hover:scale-90 active:scale-75'
          onClick={() => changeIndex(activeIndex - 1)}
        ></button>
      </div>
    </>
  )
}
