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

export const srcImages = [
  './assets/images/wrapper.jpg',
  './assets/videos/game-over.gif',
  './assets/images/blood.png',
  './assets/images/you.png',
  './assets/images/died.png',
  './assets/images/100.png',
  './assets/images/deal.png',
  './assets/images/no-deal.png',
  './assets/images/bullet-chambe.png',
  './assets/images/body.png',
  './assets/images/pull.png',
  './assets/images/bottom-line.png',
  './assets/images/settings.png',
  './assets/images/bag.png',
  './assets/images/bet.png',
  './assets/images/bullet.png',
  './assets/images/multiplier.png',
]
