import { useEffect, useState } from 'react'

import { useSettingsStore } from '@/store/settings.store'
import { useGameStore } from '@/store/game.store'
import { IMAGES } from '@/lib/constants'
import { cn, preloadImage, waitEndAudio } from '@/lib/utils'

let imageVersion = Date.now()

const GameOver = ({
  timeout = 3000,
  hasImage = true,
  onClick,
  onTimeout,
}: {
  timeout?: number
  hasImage?: boolean
  onClick: () => void
  onTimeout: () => void
}) => {
  const state = useGameStore(({ state }) => state)
  const playAudio = useSettingsStore(({ playAudio }) => playAudio)
  const blood = useSettingsStore(({ blood }) => blood)
  const [disabled, setDisabled] = useState(true)
  const [image, setImage] = useState<string>(IMAGES.gameover)
  const [runAnimation, setRunAnimation] = useState(false)
  const show = state === 'game-over'

  const handleClick = () => {
    onClick()
  }

  useEffect(() => {
    if (show) {
      return
    }

    setRunAnimation(false)
    setImage(`${IMAGES.gameover}?v=${imageVersion++}`)
  }, [show])

  useEffect(() => {
    if (!show) {
      return
    }

    const timeoutId = setTimeout(() => {
      // TODO: CHANGE TO ON TIMEOUT
      onTimeout()
    }, timeout)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [timeout, show, onTimeout])

  useEffect(() => {
    if (!show) {
      return
    }

    setDisabled(true)

    const runAnimation = async () => {
      const drumBeatAudio = await playAudio('drumbeat')

      setRunAnimation(true)

      await waitEndAudio(drumBeatAudio)

      setDisabled(false)
      setRunAnimation(true)
    }
    runAnimation()
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
      <div
        className={cn(
          'absolute inset-0 bg-cover bg-center',
          'animate-in fade-in fill-mode-both duration-100',
        )}
        style={!blood ? { backgroundImage: `url(${IMAGES.blood})` } : {}}
      >
        <div
          className={cn(
            'w-[143px absolute bottom-[70%] left-[30%] h-[143px] w-[143px] bg-contain bg-center text-5xl text-transparent uppercase select-none',
            'animate-in fade-in fill-mode-both delay-100 duration-100',
          )}
          style={{ backgroundImage: `url(${IMAGES.you})` }}
        >
          You
        </div>
        <div
          className={cn(
            'uppercasee absolute top-[46%] right-[8%] h-[153px] w-[158px] bg-contain bg-center text-5xl text-transparent select-none',
            'animate-in fade-in fill-mode-both delay-200 duration-100',
          )}
          style={{ backgroundImage: `url(${IMAGES.died})` }}
        >
          Died
        </div>
      </div>
    </button>
  )
}

export { GameOver }
