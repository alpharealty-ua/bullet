import { toast } from 'react-toastify'

// TODO: FIX
// TODO: ADDED LOG TO COMPONENT
// @ts-ignore
export const addLogEntry = (message: string, type: string) => {}

export const notify = (
  message: string,
  type: 'info' | 'success' | 'error' | 'warning',
) => {
  toast[type](message)
}
