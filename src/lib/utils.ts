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

export const formatNumber = (value: number) =>
  value.toLocaleString('en-US', {
    maximumFractionDigits: 5,
    notation: 'compact',
    compactDisplay: 'short',
  })

export const addZerro = (number: number) => `${number > 9 ? '' : `0`}${number}`

export const wait = (timeout: number) =>
  new Promise((res) => setTimeout(res, timeout))

export const getAudio = (key: keyof typeof audios): HTMLAudioElement => {
  const audiosDom = document.getElementById('audios')

  const selector = `[data-audio=${key}]`

  const audio = ((audiosDom ?? document).querySelector(selector) ??
    new Audio(audios[key])) as HTMLAudioElement

  return audio
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
