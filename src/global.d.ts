type Prettify<T> = {
  [P in keyof T]: T[P]
} & {}

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
