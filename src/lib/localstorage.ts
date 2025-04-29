import { LOCAL_STORAGE_KEYS, LocalStorageKeys } from '@/lib/constants'

export const setItem = (key: LocalStorageKeys, value: string): void => {
  localStorage.setItem(LOCAL_STORAGE_KEYS[key], JSON.stringify(value))
}

export const getItem = (key: LocalStorageKeys): string | undefined => {
  const item = localStorage.getItem(LOCAL_STORAGE_KEYS[key])
  return item ? JSON.parse(item) : undefined
}

export const removeItem = (key: LocalStorageKeys): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEYS[key])
}
