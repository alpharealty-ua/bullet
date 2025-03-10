import { createPortal } from 'react-dom'
import { useQueryClient } from '@tanstack/react-query'

import { removeToken } from '@/lib/localstorage'
import { useSoloStore } from '@/store/solo.store'
import { StateGame, STATES, MULTIPLIERS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button as ButtonWithAudio } from '@/components/ui/button'
import { QUERY_KEYS } from '@/api/api'

const Debug = () => {
  const queryClient = useQueryClient()
  const setCountBullet = useSoloStore(({ setCountBullet }) => setCountBullet)
  const setState = useSoloStore(({ setState }) => setState)
  const setMultiplier = useSoloStore(({ setMultiplier }) => setMultiplier)
  const state = useSoloStore(({ state }) => state)
  const countBullet = useSoloStore(({ countBullet }) => countBullet)
  const multiplierIndex = useSoloStore(({ multiplierIndex }) => multiplierIndex)

  const handleSetState = (s: StateGame) => {
    setState(s)
  }

  const handleResetAddMoney = () => {
    localStorage.removeItem('endTime')
  }

  const handleLogout = async () => {
    removeToken()
    await queryClient.setQueryData([QUERY_KEYS.profile], null)
  }

  if (!localStorage.getItem('showDebug')) {
    return null
  }

  return createPortal(
    <div className='absolute top-0 right-[calc(50%+var(--width)/2)] flex w-[200px] flex-col gap-2 bg-amber-100 p-4'>
      <h1 className='text-xs'>
        Current state - <strong className='block'>{state}</strong>
      </h1>
      <ButtonWithAudio
        text='Logout'
        className='text-base'
        onClick={handleLogout}
      />
      <ButtonWithAudio
        text='Reset add money'
        className='text-base'
        onClick={handleResetAddMoney}
      />
      {STATES.map((el, i) => (
        <ButtonWithAudio
          key={i}
          className={cn('text-base', el === state && 'text-white')}
          onClick={() => handleSetState(el)}
          text={el}
        />
      ))}
      <div className='flex flex-col gap-2'>
        <label>
          <div className=''>State</div>
          <select
            className='h-10 w-full bg-white px-2 uppercase'
            value={state}
            onChange={(e) => handleSetState(e.target.value as StateGame)}
          >
            {STATES.map((state, i) => (
              <option key={i} value={state}>
                {state}
              </option>
            ))}
          </select>
        </label>

        <label>
          <div className=''>Multiplier</div>
          <select
            className='h-10 w-full bg-white px-2 uppercase'
            value={multiplierIndex}
            onChange={(e) => setMultiplier(Number(e.target.value))}
          >
            <option value='-1'>-1</option>
            {MULTIPLIERS.map((value, i) => (
              <option key={i} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label>
          <div className=''>Count bullet</div>
          <select
            className='h-10 w-full bg-white px-2 uppercase'
            value={countBullet}
            onChange={(e) => setCountBullet(Number(e.target.value))}
          >
            {Array(5)
              .fill(null)
              .map((_, i) => i + 1)
              .map((el) => (
                <option key={el} value={el}>
                  {el}
                </option>
              ))}
          </select>
        </label>
      </div>
    </div>,
    document.body,
  )
}

export { Debug }
