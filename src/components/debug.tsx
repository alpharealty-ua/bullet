import classNames from 'classnames'
import { State, states, multipliers } from '../utils/constants'
import { useAppContext } from '../context'

const Debug = () => {
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
    if (s === state) {
      setState('reset')
    }
    setTimeout(() => {
      setState(s)
    }, 0)
  }

  return (
    <div className='absolute flex flex-col gap-2 top-0 right-full w-[200px] p-4 bg-amber-100'>
      <h1>
        Current state - <strong>{state}</strong>
      </h1>
      {states.map((el, i) => (
        <button
          key={i}
          className={classNames(
            'h-10 p-2 bg-amber-300 hover:bg-amber-400 cursor-pointer transition-colors',
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
            className='bg-white h-10 w-full px-2'
          />
        </label>
        <label>
          <div className='font-black'>Bet</div>
          <input
            type='number'
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            className='bg-white h-10 w-full px-2'
          />
        </label>
        <label>
          <div className='font-black'>Multiplier</div>
          <select
            className='bg-white h-10 w-full px-2'
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
            className='bg-white h-10 w-full px-2'
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
