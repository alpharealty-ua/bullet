import { State, states, multipliers } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button as ButtonWithAudio } from '@/components/ui/button'

interface Props {
  state: State
  changeState: React.Dispatch<State>
  balance: number
  setBalance: React.Dispatch<number>
  countBullet: number
  setCountBullet: React.Dispatch<number>
  bet: number
  setBet: React.Dispatch<number>
  activeMultiplierIndex: number
  setActiveMultiplierIndex: React.Dispatch<number>
}

const Debug = (props: Props) => {
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
  } = props

  const handleSetState = (s: State) => {
    setState(s)
  }

  const handleResetAddMoney = () => {
    localStorage.removeItem('endTime')
  }

  if (!localStorage.getItem('showDebug')) {
    return null
  }

  return (
    <div className='absolute top-0 right-full flex w-[200px] flex-col gap-2 bg-amber-100 p-4'>
      <h1 className='text-xs'>
        Current state - <strong className='block'>{state}</strong>
      </h1>
      <ButtonWithAudio
        text='Reset add money'
        className='text-base'
        onClick={handleResetAddMoney}
      />
      {states.map((el, i) => (
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
            onChange={(e) => handleSetState(e.target.value as State)}
          >
            {states.map((state, i) => (
              <option key={i} value={state}>
                {state}
              </option>
            ))}
          </select>
        </label>
        <label>
          <div className=''>Balance</div>
          <input
            type='text'
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            className='h-10 w-full bg-white px-2 uppercase'
          />
        </label>
        <label>
          <div className=''>Bet</div>
          <input
            type='number'
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            className='h-10 w-full bg-white px-2 uppercase'
          />
        </label>
        <label>
          <div className=''>Multiplier</div>
          <select
            className='h-10 w-full bg-white px-2 uppercase'
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
    </div>
  )
}

export { Debug }
