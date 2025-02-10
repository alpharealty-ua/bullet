export const multipliers = [2, 5, 10, 25, 100, 1000]

export const states = [
  'cover',
  'rules',
  'settings',
  'add-money',
  'init-game',
  'pull',
  'game-over',
] as const

export type State = (typeof states)[number]

export const images = {
  gamerules: './assets/images/gamerules.svg',
  close: './assets/images/close.svg',
  money: './assets/images/compressed/money.png',
  logo: './assets/images/compressed/logo.png',
  wrapper: './assets/images/wrapper.png',
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
  bottomLine: './assets/images/compressed/bottom-line.png',
  settings: './assets/images/compressed/settings.png',
  bet: './assets/images/compressed/bet.png',
  bullet: './assets/images/compressed/bullet.png',
  multiplier: './assets/images/compressed/multiplier.png',
  balance: './assets/images/compressed/balance.png',
  slider: './assets/images/compressed/slider.png',
  '1000x': './assets/images/compressed/1000x.png',
  '100000$': './assets/images/compressed/100000$.png',
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

export const INIT_BALANCE = 12345

export const MAX_BET = 1000

export const settings = {
  music: 'Toggle music',
  soundEffects: 'Toggle sound effects',
  invertButtons: 'Invert PULL AND DEAL button positions',
  blood: 'Toggles off blood',
}

export const settingsEntries = Object.entries(settings) as [
  SettingsKeys,
  string,
][]

export type SettingsKeys = keyof typeof settings
