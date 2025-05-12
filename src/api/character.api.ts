import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api, QUERY_KEYS, ROUTE_PREFIX } from '@/api/api'
import { CharacterName } from '@/lib/constants'
import {
  CharacterListSchema,
  characterSchemaArray,
  UserCharacterListSchema,
  userCharacterSchemaArray,
} from '@/lib/schemas/character.schema'

const prefix = ROUTE_PREFIX.character

const routes = {
  characters: `/${prefix}/characters`,
  purchase: (characterName: string) =>
    `/${prefix}/characters/purchase/${characterName}`,
  userCharacters: `/${prefix}/characters/user`,
} as const

type CharactersResponse = Character[]
type UserCharactersResponse = UserCharacter[]

interface Character {
  id: string
  name: string
  description: string
  imageUrl: string
  isFree: boolean
  price: string
  coinId: string
  networkId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  formattedPrice: string | number
  network: Network
  coin: Coin
}

interface Network {
  id: string
  name: string
  symbol: string
  isDefault: boolean
  status: string
  createdAt: string
  updatedAt: string
}

interface Coin {
  id: string
  name: string
  symbol: string
  type: string
  decimals: number
  isDefault: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

type UserCharacter = Character & { purchased: boolean }

export const fetchCharacters = async (): Promise<CharacterListSchema> => {
  const { data } = await api.get<CharactersResponse>(routes.characters)
  return characterSchemaArray.parse(data)
}

export const fetchUserCharacters =
  async (): Promise<UserCharacterListSchema> => {
    const { data } = await api.get<UserCharactersResponse>(
      routes.userCharacters,
    )

    return [
      // @ts-ignore
      // TODO: BACKEND. REMOVE LATER, ONLY FOR TEST
      {
        id: 'daisy',
        purchased: true,
        formattedPrice: 0,
      },
      ...userCharacterSchemaArray.parse(data),
    ]
  }

export const purchaseCharacter = async (
  characterName: CharacterName,
): Promise<void> => {
  const { data } = await api.post<void>(routes.purchase(characterName))
  return data
}

export const useCharacters = () =>
  useQuery({
    queryKey: [QUERY_KEYS.characters],
    queryFn: fetchCharacters,
  })

export const useUserCharacters = () =>
  useQuery({
    queryKey: [QUERY_KEYS.userCharacters],
    queryFn: fetchUserCharacters,
  })

export const usePurchaseCharacter = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: purchaseCharacter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userCharacters] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.balance] })
    },
    onMutate: async (characterName: CharacterName) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.userCharacters] })

      const prevUserCharacters = queryClient.getQueryData([
        QUERY_KEYS.userCharacters,
      ]) as UserCharactersResponse

      queryClient.setQueryData(
        [QUERY_KEYS.userCharacters],
        (prev: UserCharactersResponse) =>
          prev.map((u) => ({
            ...u,
            purchased: u.id === characterName ? true : u.purchased,
          })),
      )

      return { prevUserCharacters }
    },
    onError: (_, _2, context) => {
      queryClient.setQueryData(
        [QUERY_KEYS.userCharacters],
        context?.prevUserCharacters,
      )
    },
  })
}
