import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api, ROUTE_PREFIX, QUERY_KEYS } from '@/api/api'
import { useProfile } from '@/api/auth.api'
import { balanceSchema, BalanceSchema } from '@/lib/schemas/wallet.schema'

export interface FetchBalanceResponse {
  balance: {
    amount: string
    lockedAmount: string
    formattedAmount: number
    formattedLockedAmount: number
  }
  activeSelection?: Record<string, unknown>
}

interface AddBalancePayload {
  userId: string
  networkId: string
  coinId: string
  amount: string
  description: string
}

const prefix = ROUTE_PREFIX.wallet

const routes = {
  balance: `/${prefix}/balance`,
  addBalance: `/${prefix}/add-balance`,
} as const

export const fetchBalance = async (): Promise<BalanceSchema> => {
  const { data } = await api.get<FetchBalanceResponse>(routes.balance)
  return balanceSchema.parse(data)
}

export const addBalance = async (payload: AddBalancePayload): Promise<void> => {
  const { data } = await api.post<void>(routes.addBalance, payload)
  return data
}

export const useBalance = (enabled = false) => {
  const data = useQuery({
    enabled,
    queryKey: [QUERY_KEYS.balance],
    queryFn: fetchBalance,
    select: (data) => Number(data.balance.formattedAmount),
  })
  return { ...data, data: data.data ?? 0 }
}

export const useAddBalance = () => {
  const queryClient = useQueryClient()
  const { data: profile } = useProfile()

  return useMutation({
    mutationFn: async (amount: number) => {
      if (!profile) {
        return
      }

      return addBalance({
        userId: profile.id,
        networkId: 'local',
        coinId: 'usd',
        amount: `${amount}00`,
        description: 'TEST BALANCE',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.balance] })
    },
  })
}
