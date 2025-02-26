import { useEffect, useState } from 'react'

import { images } from '@/lib/constants'
import { cn, preloadImage } from '@/lib/utils'
import { useAppContext } from '@/context/use-app-context'

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
  // TODO: NOT USE CONTEXT
  const { playAudio } = useAppContext()
  const [disabled, setDisabled] = useState(true)
  const [image, setImage] = useState<string>(images.gameover)
  const [runAnimation, setRunAnimation] = useState(false)

  const handleClick = () => {
    onClick()
  }

  useEffect(() => {
    if (show) {
      return
    }

    setRunAnimation(false)
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

    let isUnmounted = false
    setDisabled(true)

    const runAnimation = async () => {
      const drumBeatAudio = await playAudio('drumbeat', false)
      const audio = await playAudio('gunshot')

      setRunAnimation(true)

      audio.addEventListener(
        'ended',
        async () => {
          if (isUnmounted) {
            return
          }
          await drumBeatAudio.play()
        },
        { once: true },
      )

      drumBeatAudio.addEventListener(
        'ended',
        () => {
          if (isUnmounted) {
            return
          }
          setDisabled(false)
        },
        { once: true },
      )
    }
    runAnimation()

    return () => {
      isUnmounted = true
    }
  }, [show, playAudio])

  useEffect(() => {
    preloadImage(image)
  }, [image])

  return (
    <button
      className={cn(
        'fill-mode-both absolute inset-0 z-50 hidden duration-200',
        !disabled && 'cursor-pointer',
        show && runAnimation && 'flex',
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      {image && (
        <div
          className='animate-out fade-out fill-mode-both absolute inset-0 flex items-end bg-[center_calc(100%+60px)] bg-no-repeat delay-800 duration-0 lg:bg-bottom'
          style={{
            backgroundImage: `url(${image})`,
          }}
        ></div>
      )}
      <div
        className={cn(
          'absolute inset-0 bg-cover bg-center',
          'animate-in fade-in fill-mode-both duration-100',
          image && 'delay-800',
        )}
        style={!hideBlood ? { backgroundImage: `url(${images.blood})` } : {}}
      >
        <div
          className={cn(
            'w-[143px absolute bottom-[70%] left-[30%] h-[143px] w-[143px] bg-contain bg-center text-5xl text-transparent uppercase select-none',
            'animate-in fade-in fill-mode-both duration-100',
            image && 'delay-900',
            !image && 'delay-100',
          )}
          style={{ backgroundImage: `url(${images.you})` }}
        >
          You
        </div>
        <div
          className={cn(
            'uppercasee absolute top-[46%] right-[8%] h-[153px] w-[158px] bg-contain bg-center text-5xl text-transparent select-none',
            'animate-in fade-in fill-mode-both duration-100',
            image && 'delay-1000',
            !image && 'delay-200',
          )}
          style={{ backgroundImage: `url(${images.died})` }}
        >
          Died
        </div>
      </div>
    </button>
  )
}

export { GameOver }
