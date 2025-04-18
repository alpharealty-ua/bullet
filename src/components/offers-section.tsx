import { Balance } from '@/components/balance/balance'
import { OffersList } from '@/components/offers-list'

interface OffersSectionProps {}

const OffersSection = (_: OffersSectionProps) => {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='relative flex flex-col items-end'>
          <div className='text-green text-center text-2xl leading-[1] tracking-tight uppercase'>
            Balance
          </div>
          <Balance />
        </div>
      </div>
      <OffersList />
    </div>
  )
}

export { OffersSection }
