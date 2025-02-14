import { useEffect, useState } from 'react'

import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'

const GameOver = ({
  onClick,
  onTimeout,
  timeout,
  image,
  hideBlood,
}: {
  onClick: () => void
  onTimeout: () => void
  timeout: number
  image: string
  hideBlood?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(true)

  const handleClick = () => {
    setIsOpen(false)
    onClick()
  }

  useEffect(() => {
    const id = setTimeout(onTimeout, timeout)
    return () => {
      clearTimeout(id)
    }
  }, [onTimeout, timeout])

  return (
    <div
      className={cn(
        'fill-mode-both absolute inset-0 z-50 cursor-pointer duration-200',
        isOpen
          ? 'animate-in fade-in-0 zoom-in-95'
          : 'animate-out fade-out-0 zoom-out-95',
      )}
      onClick={handleClick}
    >
      <div
        className='animate-out fade-out fill-mode-both absolute inset-0 flex items-end bg-[center_calc(100%+60px)] bg-no-repeat delay-[800ms] duration-0 lg:bg-bottom'
        style={{
          backgroundImage: `url(${image})`,
        }}
      ></div>
      <div
        className='animate-in fade-in fill-mode-both absolute inset-0 bg-cover bg-center delay-[800ms] duration-100'
        style={!hideBlood ? { backgroundImage: `url(${images.blood})` } : {}}
      >
        <div
          className='animate-in fade-in fill-mode-both w-[143px absolute bottom-[70%] left-[30%] h-[143px] w-[143px] bg-contain bg-center delay-[900ms] duration-100'
          style={{ backgroundImage: `url(${images.you})` }}
        ></div>
        <div
          className='animate-in fade-in fill-mode-both absolute top-[48%] right-[8%] h-[153px] w-[158px] bg-contain bg-center delay-1000 duration-100'
          style={{ backgroundImage: `url(${images.died})` }}
        ></div>
      </div>
    </div>
  )
}

export { GameOver }
