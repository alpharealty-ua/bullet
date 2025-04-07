import { useState } from 'react'

import { wait } from '@/lib/utils'

const SHOW_TIMEOUT = 400

const useUpdateShow = <ComponentState extends { show: boolean }>(
  intiState: ComponentState,
  timeout = SHOW_TIMEOUT,
) => {
  const [state, setState] = useState(intiState)
  const updateState = async (newState: Partial<ComponentState>) => {
    setState((p) => ({ ...p, ...newState }))
    if ('show' in newState && newState.show !== state.show) {
      await wait(SHOW_TIMEOUT).promise
    }
  }

  return [state, updateState, timeout] as const
}

export { useUpdateShow }
