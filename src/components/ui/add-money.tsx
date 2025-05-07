import { ComponentProps } from 'react'

import { Balance } from '@/components/balance/balance'
import { OffersList } from '@/components/offers-list'
import { cn } from '@/lib/utils'

interface AddMoneyProps extends ComponentProps<'div'> {}

const AddMoney = ({ className, ...props }: AddMoneyProps) => {
  return (
    <div className={cn('flex flex-col', className)} {...props}>
      <div className='flex items-center justify-between'>
        <div className='relative flex flex-col items-end'>
          <div className='text-green text-center text-2xl leading-[1] tracking-tight uppercase'>
            Balance
          </div>
          <Balance />
        </div>
      </div>
      <div className='mt-6'>
        <OffersList />
      </div>
    </div>
  )
}

export { AddMoney }
