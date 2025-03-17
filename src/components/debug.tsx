import { createPortal } from 'react-dom'
import { useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/api/api'
import { useGameStore } from '@/store/game.store'
import { useAuthStore } from '@/store/auth.store'
import { StateGame, STATES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button as ButtonWithAudio } from '@/components/ui/button'

const Debug = () => {
  const queryClient = useQueryClient()
  const resetToken = useAuthStore(({ resetToken }) => resetToken)
  const setCountBullet = useGameStore(({ setCountBullet }) => setCountBullet)
  const setState = useGameStore(({ setState }) => setState)
  const state = useGameStore(({ state }) => state)
  const countBullet = useGameStore(({ countBullet }) => countBullet)

  const handleSetState = (s: StateGame) => {
    setState(s)
  }

  const handleResetAddMoney = () => {
    // TODO: RENAEM KEY
    localStorage.removeItem('endTime')
  }

  const handleLogout = async () => {
    resetToken()
    await queryClient.setQueryData([QUERY_KEYS.profile], null)
  }

  if (!localStorage.getItem('SHOW_DEBUG')) {
    return null
  }

  return createPortal(
    <div className='absolute top-0 right-[calc(50%+var(--width)/2)] flex w-[200px] flex-col gap-2 bg-amber-100 p-4'>
      <h1 className='text-xs'>
        Current state - <strong className='block'>{state}</strong>
      </h1>
      <ButtonWithAudio
        as='button'
        className='text-base'
        text='Logout'
        bg='primary'
        onClick={handleLogout}
      />
      <ButtonWithAudio
        as='button'
        className='text-base'
        text='Reset add money'
        bg='primary'
        onClick={handleResetAddMoney}
      />
      {STATES.map((el, i) => (
        <ButtonWithAudio
          as='button'
          key={i}
          className={cn('text-base', el === state && 'text-white')}
          onClick={() => handleSetState(el)}
          bg='primary'
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
