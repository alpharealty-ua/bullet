import { images } from '@/lib/constants'

const Balance = ({ value }: { value: number }) => {
  return (
    <div className='flex flex-col'>
      <div
        className='bg-contain bg-center bg-no-repeat text-[30px] leading-[1] tracking-tight text-[#006100] uppercase'
        style={{ backgroundImage: `url(${images.balance})` }}
      >
        <span className='text-transparent'>Balance</span>
      </div>
      <div className='text-center text-3xl leading-[1] tracking-tight'>
        ${value}
      </div>
    </div>
  )
}

export { Balance }
