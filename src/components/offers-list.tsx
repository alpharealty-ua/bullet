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

    const updateTime = () => {
      const nextClaimTime = new Date(offer.nextClaimAt!).getTime()
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
    <div className='mb-4 rounded-lg p-4'>
      <div className='flex items-start justify-between'>
        <div>
          <h3 className='text-lg font-medium'>{offer.name}</h3>
          <p className='text-sm text-gray-500'>{offer.description}</p>
          <p className='mt-2 font-semibold text-green-600'>
            Reward: {offer.formattedRewardAmount} {offer.coin.symbol}
          </p>
        </div>
        <ButtonWithAudio
          className={cn(
            offer.canClaim ? 'bg-primary' : 'bg-gray-400',
            isPending && 'cursor-not-allowed opacity-75',
          )}
          disabled={!offer.canClaim || isPending}
          onClick={handleClaim}
          as='button'
          bg='primary'
          text={
            isPending ? 'Claiming...' : offer.canClaim ? 'Claim' : 'Claimed'
          }
        />
      </div>

      {timeLeft && (
        <div className='mt-2 text-sm text-gray-500'>
          Available again in: {timeLeft}
        </div>
      )}
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
      <div className='py-4 text-center text-red-500'>Failed to load offers</div>
    )
  }

  if (!data?.data.length) {
    return <div className='py-4 text-center'>No offers available</div>
  }

  return (
    <div className='mt-4'>
      <h2 className='mb-4 text-xl font-bold'>Available Offers</h2>
      <div>
        {data.data.map((offer) => (
          <OfferItem key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  )
}

export { OffersList }
