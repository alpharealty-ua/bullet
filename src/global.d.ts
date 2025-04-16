type Prettify<T> = {
  [P in keyof T]: T[P]
} & {}

type User = {
  id: string
  email: string
  name: string
  status: 'ACTIVE'
  username: string
}

type Message = {
  id: string
  user: string
  message: string
}

type Wager = {
  id: string
  user: string
  money: number
  result: 'win' | 'lose'
}

type UserCharacter = Character & { purchased: boolean }

interface Character {
  id: CharacterName
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
  network: Network
  coin: Coin
  formattedPrice: string | number
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
