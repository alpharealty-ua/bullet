import { useEffect, useState } from 'react'

import { images } from '@/lib/constants'
import { cn, preloadImage } from '@/lib/utils'

let imageVersion = Date.now()

const GameOver = ({
  onClick,
  onTimeout,
  timeout,
  hideBlood,
  show,
}: {
  onClick: () => void
  onTimeout: () => void
  timeout: number
  hideBlood?: boolean
  show: boolean
}) => {
  const [disabled, setDisabled] = useState(true)
  const [image, setImage] = useState<string>(images.gameover)

  const handleClick = () => {
    onClick()
  }

  useEffect(() => {
    if (show) {
      return
    }

    setImage(`${images.gameover}?v=${imageVersion++}`)
  }, [show])

  useEffect(() => {
    if (!show) {
      return
    }

    const timeoutId = setTimeout(onTimeout, timeout)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [onTimeout, timeout, show])

  useEffect(() => {
    if (!show) {
      return
    }

    setDisabled(true)
    const TIME_ANIMATION = 1100
    const timeoutId = setTimeout(() => setDisabled(false), TIME_ANIMATION)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [show])

  useEffect(() => {
    preloadImage(image)
  }, [image])

  return (
    <button
      className={cn(
        'fill-mode-both absolute inset-0 z-50 hidden duration-200',
        !disabled && 'cursor-pointer',
        show && 'flex',
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      <div
        className='animate-out fade-out fill-mode-both absolute inset-0 flex items-end bg-[center_calc(100%+60px)] bg-no-repeat delay-800 duration-0 lg:bg-bottom'
        style={{
          backgroundImage: `url(${image})`,
        }}
      ></div>
      <div
        className='animate-in fade-in fill-mode-both absolute inset-0 bg-cover bg-center delay-800 duration-100'
        style={!hideBlood ? { backgroundImage: `url(${images.blood})` } : {}}
      >
        <div
          className='animate-in fade-in fill-mode-both w-[143px absolute bottom-[70%] left-[30%] h-[143px] w-[143px] bg-contain bg-center text-5xl text-transparent uppercase delay-900 duration-100 select-none'
          style={{ backgroundImage: `url(${images.you})` }}
        >
          You
        </div>
        <div
          className='animate-in fade-in fill-mode-both uppercasee absolute top-[46%] right-[8%] h-[153px] w-[158px] bg-contain bg-center text-5xl text-transparent delay-1000 duration-100 select-none'
          style={{ backgroundImage: `url(${images.died})` }}
        >
          Died
        </div>
      </div>
    </button>
  )
}

export { GameOver }
