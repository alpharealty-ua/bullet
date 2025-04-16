import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api, QUERY_KEYS, SVC } from '@/api/api'
import { CharacterName } from '@/lib/constants'

const svc = SVC.character

const routes = {
  characters: `/${svc}/characters`,
  purchase: `/${svc}/characters/purchase`,
  userCharacters: `/${svc}/characters/user`,
} as const

type CharactersResponse = Character[]
type UserCharactersResponse = UserCharacter[]

export const fetchCharacters = async (): Promise<CharactersResponse> => {
  // TODO: VALIDATE ID CHARACTERS
  const { data } = await api.get<CharactersResponse>(routes.characters)
  return data
}

export const fetchUserCharacters =
  async (): Promise<UserCharactersResponse> => {
    const { data } = await api.get<UserCharactersResponse>(
      routes.userCharacters,
    )
    return data
  }

export const purchaseCharacter = async (
  characterName: CharacterName,
): Promise<void> => {
  const { data } = await api.post<void>(`${routes.purchase}/${characterName}`)
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
