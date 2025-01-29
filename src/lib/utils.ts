import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { audios } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const onlyDigit = (key: string) =>
  (key >= '0' && key <= '9') ||
  [
    '+',
    '(',
    ')',
    '-',
    'ArrowLeft',
    'ArrowRight',
    'Delete',
    'Backspace',
    'Enter',
  ].includes(key)

export const playAudio = (key: keyof typeof audios) => {
  const audios = document.getElementById('audios')

  if (audios === null) {
    return
  }

  const selector = `.audio-${key}`

  const audio = audios.querySelector(selector) as HTMLAudioElement

  if (audio === null) {
    return
  }

  audio
    .play()
    .then(() => {
      console.log('Play audio - ' + audio.src)
    })
    .catch(console.log)
}
