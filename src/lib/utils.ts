import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { audios } from '@/lib/constants'

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

export const formatBet = (value: number) => {
  if (value >= 1000) return ((value / 100) ^ 0) / 10 + 'K'
  return String(value)
}

export const addZerro = (number: number) => `${number > 9 ? '' : `0`}${number}`

export const wait = (timeout: number) =>
  new Promise((res) => setTimeout(res, timeout))

export const playAudio = async (
  key: keyof typeof audios,
): Promise<HTMLAudioElement | null> => {
  const src = audios[key]

  const audio = new Audio(src)

  try {
    await audio.play()
    console.log('Play audio - ' + audio.src)

    return audio
  } catch (error) {
    console.log(error)

    return null
  }
}
