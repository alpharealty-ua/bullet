import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { useClaimOffer, UserOffer, useUserOffers } from '@/api/offer.api'
import { cn, formatTimeRemaining } from '@/lib/utils'
import { ButtonWithAudio } from './ui/button-with-audio'

const OfferItem = ({ offer }: { offer: UserOffer }) => {
  const { mutate: claimOffer, isPending } = useClaimOffer()
  const [timeLeft, setTimeLeft] = useState<string | null>(null)

  useEffect(() => {
    if (!offer.nextClaimAt) return

    const nextClaimTime = new Date(offer.nextClaimAt!).getTime()

    const updateTime = () => {
      const now = Date.now()
      const diff = nextClaimTime - now

      if (diff <= 0) {
        setTimeLeft(null)
        return
      }

      setTimeLeft(formatTimeRemaining(diff))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [offer.nextClaimAt])

  const handleClaim = () => {
    claimOffer(offer.id, {
      onSuccess: (response) => {
        if (response.processedAt) {
          toast.success(
            `Claimed ${offer.formattedRewardAmount} ${offer.coin.symbol}!`,
          )
        } else {
          toast.info(response.message || 'Unable to claim reward at this time')
        }
      },
      onError: () => {
        toast.error('Failed to claim reward. Please try again.')
      },
    })
  }

  return (
    <div className='flex items-start justify-between gap-4'>
      <div className='flex flex-col gap-2'>
        <div>
          <h3 className='text-lg font-medium'>{offer.name}</h3>
          <p className='text-sm text-gray-500'>{offer.description}</p>
        </div>
        <p className='text-green font-semibold'>
          Reward: {offer.formattedRewardAmount} {offer.coin.symbol}
        </p>
        {timeLeft && (
          <div className='text-sm text-gray-500'>
            Available again in: {timeLeft}
          </div>
        )}
      </div>
      <div className='flex min-w-34 shrink-0 justify-end'>
        <ButtonWithAudio
          className={cn(
            'w-full',
            isPending && 'text-lg opacity-75 transition-none',
          )}
          disabled={!offer.canClaim || isPending}
          onClick={handleClaim}
          as='button'
          bg={offer.canClaim ? 'primary' : 'gray'}
        >
          {isPending ? 'Claiming...' : offer.canClaim ? 'Claim' : 'Claimed'}
        </ButtonWithAudio>
      </div>
    </div>
  )
}

const OffersList = () => {
  const { data, isLoading, error } = useUserOffers()

  if (isLoading) {
    return <div className='py-4 text-center'>Loading offers...</div>
  }

  if (error) {
    return (
      <div className='text-red py-4 text-center'>Failed to load offers</div>
    )
  }

  if (!data?.data.length) {
    return <div className='py-4 text-center'>No offers available</div>
  }

  return (
    <div className='flex flex-col gap-2'>
      <h2 className='text-xl font-bold'>Available Offers</h2>
      <div className='flex flex-col gap-8'>
        {data.data.map((offer) => (
          <OfferItem key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  )
}

export { OffersList }
