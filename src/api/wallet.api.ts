import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api, ROUTE_PREFIX, QUERY_KEYS } from '@/api/api'

interface FetchBalanceResponse {
  balance: {
    amount: string
    formattedAmount: string
  }
  activeSelection?: Record<string, unknown>
}

interface AddBalanceResponse {
  amount: string
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

export const fetchBalance = async (): Promise<FetchBalanceResponse> => {
  const { data } = await api.get<FetchBalanceResponse>(routes.balance)
  return data
}

export const addBalance = async (
  payload: AddBalancePayload,
): Promise<AddBalanceResponse> => {
  const { data } = await api.post<AddBalanceResponse>(
    routes.addBalance,
    payload,
  )
  return data
}

export const useBalance = (enabled = false) => {
  const data = useQuery({
    enabled,
    queryKey: [QUERY_KEYS.balance],
    queryFn: fetchBalance,
    select: (data) => Number(data.balance.amount),
  })
  return { ...data, data: data.data ?? 0 }
}

export const useAddBalance = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addBalance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.balance] })
    },
  })
}
