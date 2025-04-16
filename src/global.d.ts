type Prettify<T> = {
  [P in keyof T]: T[P]
} & {}

// TODO: TRANSFORM TO SCHEMAS
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
