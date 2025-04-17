import { useState } from 'react'

import { wait } from '@/lib/utils'

const SHOW_TIMEOUT = 400

type UpdateShowAction<A> = Partial<A> | ((s: A) => A)

export interface UpdateShowMethods<T> {
  updateState: DispatchUpdateShow<T>
  show: () => Promise<void>
  hide: () => Promise<void>
  reset: () => Promise<void>
}

export interface DispatchUpdateShow<ComponentState> {
  (newState: UpdateShowAction<ComponentState>): Promise<void>
}

const useUpdateShow = <ComponentState extends { show: boolean }>(
  intiState: ComponentState,
  timeout = SHOW_TIMEOUT,
) => {
  const [state, setState] = useState(intiState)
  const updateState: DispatchUpdateShow<ComponentState> = async (
    newState: UpdateShowAction<ComponentState>,
  ) => {
    setState((p) =>
      typeof newState === 'function'
        ? newState(p)
        : {
            ...p,
            ...newState,
          },
    )
    if ('show' in newState && newState.show !== state.show) {
      await wait(SHOW_TIMEOUT).promise
    }
  }

  const show = () => updateState({ show: true } as Partial<ComponentState>)

  const hide = () => updateState({ show: false } as Partial<ComponentState>)

  const reset = () => updateState(intiState)

  return { state, updateState, show, hide, reset, timeout }
}

export { useUpdateShow }
