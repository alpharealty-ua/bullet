import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { AudioKeys, AUDIOS } from '@/lib/constants'

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

export const formatNumber = (value: number) =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export const addZerro = (number: number) => `${number > 9 ? '' : `0`}${number}`

export const wait = (timeout: number) => {
  let timeoutId: number = 0
  const promise = new Promise<void>(
    (res) => (timeoutId = window.setTimeout(res, timeout)),
  )

  return { promise, timeoutId }
}

export const getSound = (key: AudioKeys): HTMLAudioElement => {
  return new Audio(AUDIOS[key])
}

export const waitEndAudio = (audio: HTMLAudioElement) =>
  new Promise<Event>((resolve) =>
    audio.addEventListener('ended', resolve, { once: true }),
  )

export const preloadImage = async (src: string) => {
  const image = new Image()
  const imageSrc = `${src}`
  image.src = imageSrc

  return new Promise((resolve) => {
    image.addEventListener('load', resolve)
  })
}

const UTC = Date.now()

export const addId = <T>(list: T[]): Prettify<T & { id: string }>[] =>
  list.map((m, i) => ({ id: String(UTC + i), ...m }))

export const formatTimeRemaining = (milliseconds: number) => {
  const seconds = Math.floor((milliseconds / 1000) % 60)
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60)
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24)

  return `${hours > 0 ? `${hours}h ` : ''}${addZerro(minutes)}m ${addZerro(seconds)}s`
}

const flags = {
  NA: '🇺🇸',
  EU: '🇪🇺',
  ASIA: '🇯🇵',
  SA: '🇧🇷',
  OCE: '🇦🇺',
} as const

export type FlagKeys = keyof typeof flags

export const getRegionFlag = (region: FlagKeys | string) => {
  return flags[region as FlagKeys] ?? '🌍'
}

export const getLevelColor = (lvl: number) => {
  if (lvl >= 91) return 'text-[#7E22CE]'
  if (lvl >= 81) return 'text-[#8B5CF6]'
  if (lvl >= 61) return 'text-[#3B82F6]'
  if (lvl >= 41) return 'text-[#10B981]'
  if (lvl >= 21) return 'text-[#F59E0B]'
  return 'text-[#9CA3AF]'
}

export const debounce = <T extends unknown[], U>(
  callback: (...args: T) => PromiseLike<U> | U,
  wait: number,
) => {
  let timeoutID: number

  return (...args: T): Promise<U> => {
    clearTimeout(timeoutID)
    return new Promise((resolve) => {
      timeoutID = window.setTimeout(() => resolve(callback(...args)), wait)
    })
  }
}
