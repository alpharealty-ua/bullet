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

export const images = {
  gamerules: './assets/images/gamerules.svg',
  close: './assets/images/close.svg',
  money: './assets/images/compressed/money.png',
  logo: './assets/images/compressed/logo.png',
  wrapper: './assets/images/compressed/wrapper.jpg',
  gameOver: './assets/images/compressed/game-over.gif',
  blood: './assets/images/compressed/blood.png',
  you: './assets/images/compressed/you.png',
  died: './assets/images/compressed/died.png',
  100: './assets/images/compressed/100.png',
  deal: './assets/images/compressed/deal.png',
  no: './assets/images/compressed/no-deal.png',
  bulletChambe: './assets/images/compressed/bullet-chambe.png',
  body: './assets/images/compressed/body.png',
  pull: './assets/images/compressed/pull.png',
  bottomLine: './assets/images/compressed/bottom-line.jpg',
  settings: './assets/images/compressed/settings.png',
  bet: './assets/images/compressed/bet.png',
  bullet: './assets/images/compressed/bullet.png',
  multiplier: './assets/images/compressed/multiplier.png',
  balance: './assets/images/compressed/balance.png',
}

export const srcImages = Object.values(images)

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
