import { WalletButtonAnimation } from './wallet-button-animation'

const Balance = ({ value }: { value: number }) => {
  return (
    <div className='flex gap-1'>
      <WalletButtonAnimation />
      <div className='flex flex-col'>
        <div className='text-2xl leading-[1] tracking-tight text-[#006100] uppercase'>
          Balance
        </div>
        <div className='text-center text-3xl leading-[1] tracking-tight'>
          ${value}
        </div>
      </div>
    </div>
  )
}

export { Balance }
