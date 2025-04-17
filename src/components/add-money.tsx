import { useBalance } from '@/api/wallet.api'
import { Balance } from '@/components/balance'
import { OffersList } from '@/components/offers-list'
import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

const AddMoney = ({ className, ...props }: ComponentProps<'div'>) => {
  const { data: balance } = useBalance()

  return (
    <div className={cn('flex flex-col', className)} {...props}>
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
