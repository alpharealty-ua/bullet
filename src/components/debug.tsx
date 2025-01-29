import classNames from 'classnames'

import { useAppContext } from '@/context/use-app-context'
import { State, states, multipliers } from '@/lib/constants'

const Debug = ({ disabled }: { disabled: boolean }) => {
  const {
    state,
    setState,
    countBullet,
    setCountBullet,
    total,
    setTotal,
    bet,
    setBet,
    activeMultiplierIndex,
    setActiveMultiplierIndex,
  } = useAppContext()

  const handleSetState = (s: State) => {
    if (disabled) {
      return
    }
    if (s === state) {
      setState('reset')
    }
    setTimeout(() => {
      setState(s)
    }, 0)
  }

  if (!location.href.includes('localhost')) {
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
          className={classNames(
            'h-10 cursor-pointer bg-amber-300 p-2 transition-colors hover:bg-amber-400',
            el === state && 'bg-amber-500',
          )}
          onClick={() => handleSetState(el)}
        >
          {el}
        </button>
      ))}
      <div className='flex flex-col gap-2'>
        <label>
          <div className='font-black'>Balance</div>
          <input
            type='text'
            value={total}
            onChange={(e) => setTotal(Number(e.target.value))}
            className='h-10 w-full bg-white px-2'
          />
        </label>
        <label>
          <div className='font-black'>Bet</div>
          <input
            type='number'
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            className='h-10 w-full bg-white px-2'
          />
        </label>
        <label>
          <div className='font-black'>Multiplier</div>
          <select
            className='h-10 w-full bg-white px-2'
            value={activeMultiplierIndex}
            onChange={(e) => setActiveMultiplierIndex(Number(e.target.value))}
          >
            {multipliers.map((el, i) => (
              <option key={i} value={i}>
                {el}
              </option>
            ))}
          </select>
        </label>
        <label>
          <div className='font-black'>Count bullet</div>
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
