import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { useSettings } from '@/store/settings.store'
import { images } from '@/lib/constants'
import { cn, preloadImage } from '@/lib/utils'
import { useAppContext } from '@/context/use-app-context'
import { ROUTES } from '@/routes/path'

let imageVersion = Date.now()

const GameOver = ({
  timeout = 3000,
  hasImage = true,
}: {
  timeout?: number
  hasImage?: boolean
}) => {
  const { playAudio, state } = useAppContext()
  const blood = useSettings(({ blood }) => blood)
  const [disabled, setDisabled] = useState(true)
  const [image, setImage] = useState<string>(images.gameover)
  const [runAnimation, setRunAnimation] = useState(false)
  const navigate = useNavigate()
  const show = state === 'game-over'

  const handleClick = () => {
    navigate(ROUTES.solo.play)
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

    const timeoutId = setTimeout(() => {
      navigate(ROUTES.solo.play)
    }, timeout)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [timeout, show, navigate])

  useEffect(() => {
    if (!show) {
      return
    }

    let isUnmounted = false
    setDisabled(true)

    const runAnimation = async () => {
      const drumBeatAudio = await playAudio('drumbeat', false)
      const gunShotAudio = await playAudio('gunshot', false)

      const gunShotPlay = async () => {
        if (isUnmounted) {
          return
        }

        setRunAnimation(true)
      }

      const gunShotEnded = async () => {
        if (isUnmounted) {
          return
        }

        await drumBeatAudio.play()
      }

      const drumBeatEnded = () => {
        if (isUnmounted) {
          return
        }

        setDisabled(false)
      }

      gunShotAudio.addEventListener('ended', gunShotEnded, { once: true })
      gunShotAudio.addEventListener('play', gunShotPlay, { once: true })
      drumBeatAudio.addEventListener('ended', drumBeatEnded, { once: true })

      if (hasImage) {
        await gunShotAudio.play()
      } else {
        gunShotAudio.dispatchEvent(new Event('play'))
        gunShotAudio.dispatchEvent(new Event('ended'))
      }
    }
    runAnimation()

    return () => {
      isUnmounted = true
    }
  }, [show, playAudio, hasImage])

  useEffect(() => {
    if (!hasImage) {
      return
    }

    preloadImage(image)
  }, [image, hasImage])

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
      {hasImage && (
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
          hasImage && 'delay-800',
        )}
        style={!blood ? { backgroundImage: `url(${images.blood})` } : {}}
      >
        <div
          className={cn(
            'w-[143px absolute bottom-[70%] left-[30%] h-[143px] w-[143px] bg-contain bg-center text-5xl text-transparent uppercase select-none',
            'animate-in fade-in fill-mode-both duration-100',
            hasImage && 'delay-900',
            !hasImage && 'delay-100',
          )}
          style={{ backgroundImage: `url(${images.you})` }}
        >
          You
        </div>
        <div
          className={cn(
            'uppercasee absolute top-[46%] right-[8%] h-[153px] w-[158px] bg-contain bg-center text-5xl text-transparent select-none',
            'animate-in fade-in fill-mode-both duration-100',
            hasImage && 'delay-1000',
            !hasImage && 'delay-200',
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
