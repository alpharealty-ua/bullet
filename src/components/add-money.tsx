import { Balance } from '@/components/balance'
import { OffersList } from '@/components/offers-list'

const AddMoney = ({ balance }: { balance: number }) => {
  return (
    <div className='flex flex-col'>
      <div className='flex items-center justify-between'>
        <div className='relative flex flex-col items-end'>
          <div className='text-green text-center text-2xl leading-[1] tracking-tight uppercase'>
            Balance
          </div>
          <Balance value={balance} />
        </div>
      </div>
      <div className='mt-6'>
        <OffersList />
      </div>
    </div>
  )
}

export { AddMoney }
