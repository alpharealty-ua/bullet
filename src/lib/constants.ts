export const multipliers = [2, 5, 10, 25, 100]

export const states = [
  'reset',
  'cover',
  'rules',
  'init-game',
  'bet',
  'pull-start',
  'multiplier',
  'pull-next',
  'next',
  'offer',
  'game-over',
] as const

export type State = (typeof states)[number]

export const srcImages = [
  './assets/images/money.svg',
  './assets/images/gamerules.svg',
  './assets/images/logo.svg',
  './assets/images/close.svg',
  './assets/images/wrapper.jpg',
  './assets/images/game-over.gif',
  './assets/images/blood.png',
  './assets/images/you.png',
  './assets/images/died.png',
  './assets/images/100.png',
  './assets/images/deal.png',
  './assets/images/no-deal.png',
  './assets/images/bullet-chambe.png',
  './assets/images/body.png',
  './assets/images/pull.png',
  './assets/images/bottom-line.jpg',
  './assets/images/settings.png',
  './assets/images/bet.png',
  './assets/images/bullet.png',
  './assets/images/multiplier.png',
]

export const audios = {
  revolverspin: './assets/audios/revolverspin.mp3',
  trigger: './assets/audios/trigger.wav',
  spin: './assets/audios/spin.mp3',
  gunshot: './assets/audios/gunshot.mp3',
  drumbeat: './assets/audios/drumbeat.wav',
  mouseClick: './assets/audios/click.wav',
}

export const audiosEntries = Object.entries(audios)

export const INIT_TOTAL = 1075
