import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api, QUERY_KEYS } from '@/api/api'

interface Coin {
  id: string
  symbol: string
  decimals: number
}

interface Network {
  id: string
  symbol: string
}

interface ClaimHistory {
  id: string
  timestamp: string
  // Add other fields as needed
}

export interface UserOffer {
  id: string
  name: string
  description: string
  type: 'RECURRING' | 'ONE_TIME'
  visibility: 'PUBLIC' | 'PRIVATE'
  claimType: 'AUTOMATIC' | 'MANUAL'
  status: 'ACTIVE' | 'INACTIVE'
  startDate: string
  endDate: string | null
  cooldownHours: number | null
  rewardAmount: string
  rewardCurrency: string
  rewardNetwork: string
  taskLogic: string
  taskData: Record<string, unknown> | null
  userIds: string[]
  groupIds: string[]
  maxClaims: number | null
  createdAt: string
  updatedAt: string
  canClaim: boolean
  nextClaimAt: string | null
  timeUntilNextClaim: string | null
  claimHistory: ClaimHistory[]
  network: Network
  coin: Coin
  formattedRewardAmount: string
}

interface UserOffersResponse {
  data: UserOffer[]
  meta: {
    total: number
    userId: string
  }
}

interface ClaimOfferResponse {
  success: boolean
  claimed: boolean
  message?: string
  processedAt: Date | null
  id?: string
  offerId?: string
  userId?: string
  status?: string
  claimedAt?: Date
  transactionId?: string | null
  reward?: {
    amount: string
    formattedAmount: string
    currency: string
    network: string
  }
}

const routes = {
  userOffers: '/offer/user-offers',
  claimOffer: (offerId: string) => `/offer/offers/${offerId}/claim`,
} as const

export const fetchUserOffers = async (): Promise<UserOffersResponse> => {
  const { data } = await api.get<UserOffersResponse>(routes.userOffers)
  return data
}

export const claimOffer = async (
  offerId: string,
): Promise<ClaimOfferResponse> => {
  const { data } = await api.post<ClaimOfferResponse>(
    routes.claimOffer(offerId),
  )
  return data
}

export const useUserOffers = (enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.userOffers],
    queryFn: fetchUserOffers,
    enabled,
  })
}

export const useClaimOffer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (offerId: string) => claimOffer(offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userOffers] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.balance] })
    },
  })
}
