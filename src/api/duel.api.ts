import { useQuery } from '@tanstack/react-query'

import { api, QUERY_KEYS } from '@/api/api'
import { CharacterName } from '@/lib/constants'

const routes = {
  characters: '/duel/characters',
} as const

export interface CharacterEntity {
  id: CharacterName
  name: string
  description: string
  imageUrl: string
  price: number
  createdAt: string
}

type CharactersResponse = CharacterEntity[]

export const fetchCharacters = async (): Promise<CharactersResponse> => {
  // TODO: VALIDATE ID CHARACTERS
  const { data } = await api.get<CharactersResponse>(routes.characters)
  return data
}

export const useCharacters = () =>
  useQuery({
    queryKey: [QUERY_KEYS.characters],
    queryFn: fetchCharacters,
  })
