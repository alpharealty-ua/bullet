import { useContext } from 'react'
import { AppContext } from './context'

export const useAppContext = () => {
  const context = useContext(AppContext)

  if (context === null) {
    throw new Error('Context not found')
  }

  return context
}
