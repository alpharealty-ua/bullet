export const multipliers = [2, 5, 10, 25, 100]

export const states = [
  'reset',
  'bet',
  'start-game',
  'pull-start',
  'multiplier',
  'pull-next',
  'next',
  'offer',
  'game-over',
] as const

export type State = (typeof states)[number]
