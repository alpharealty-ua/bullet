import { useAppContext } from '@/context/use-app-context'
import { State, states, multipliers } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

const Debug = ({ disabled }: { disabled: boolean }) => {
  const {
    state,
    changeState: setState,
    countBullet,
    setCountBullet,
    balance,
    setBalance,
    bet,
    setBet,
    activeMultiplierIndex,
    setActiveMultiplierIndex,
    game,
  } = useAppContext()

  const handleSetState = (s: State) => {
    if (disabled) {
      return
    }
    setTimeout(() => {
      setState(s)
    })
  }

  useEffect(() => {
    // TODO: REFACTOR
    if (state === 'game-over') {
      game.gameOver()
      return
    }
    if (state === 'win') {
      game.winGame()
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  if (!localStorage.getItem('showDebug') === true) {
    return null
  }

  return (
    <div className='absolute top-0 right-full flex w-[200px] flex-col gap-2 bg-amber-100 p-4'>
      <h1 className='text-xs'>
        Current state - <strong className='block'>{state}</strong>
      </h1>
      {states.map((el, i) => (
        <button
          key={i}
          className={cn(
            'h-6 cursor-pointer bg-amber-300 px-2 text-xs uppercase transition-colors hover:bg-amber-400',
            el === state && 'bg-amber-500',
          )}
          onClick={() => handleSetState(el)}
        >
          {el}
        </button>
      ))}
      <div className='flex flex-col gap-2'>
        <label>
          <div className=''>Balance</div>
          <input
            type='text'
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            className='h-10 w-full bg-white px-2'
          />
        </label>
        <label>
          <div className=''>Bet</div>
          <input
            type='number'
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            className='h-10 w-full bg-white px-2'
          />
        </label>
        <label>
          <div className=''>Multiplier</div>
          <select
            className='h-10 w-full bg-white px-2'
            value={activeMultiplierIndex}
            onChange={(e) => setActiveMultiplierIndex(Number(e.target.value))}
          >
            <option value='-1'>-1</option>
            {multipliers.map(({ value }, i) => (
              <option key={i} value={i}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label>
          <div className=''>Count bullet</div>
          <select
            className='h-10 w-full bg-white px-2'
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
    </div>
  )
}

export { Debug }
