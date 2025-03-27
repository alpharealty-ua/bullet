import { toast } from 'react-toastify'

// TODO: FIX
// @ts-ignore
export const addLogEntry = (message: string, type: string) => {
  // console.log(message, type)
}
export const debug = (_: string) => {}

export const showCustomAlert = (
  message: string,
  type: 'info' | 'success' | 'error' | 'warning',
) => {
  toast[type](message)
}
