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
  './assets/images/compressed/wrapper.jpg',
  './assets/images/compressed/game-over.gif',
  './assets/images/compressed/blood.png',
  './assets/images/compressed/you.png',
  './assets/images/compressed/died.png',
  './assets/images/compressed/100.png',
  './assets/images/compressed/deal.png',
  './assets/images/compressed/no-deal.png',
  './assets/images/compressed/bullet-chambe.png',
  './assets/images/compressed/body.png',
  './assets/images/compressed/pull.png',
  './assets/images/compressed/bottom-line.jpg',
  './assets/images/compressed/settings.png',
  './assets/images/compressed/bet.png',
  './assets/images/compressed/bullet.png',
  './assets/images/compressed/multiplier.png',
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
