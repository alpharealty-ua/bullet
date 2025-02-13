export const multipliers: { value: number; color: `#${string}` }[] = [
  { value: 2, color: '#2d95ff' },
  { value: 3, color: '#ff8787' },
  { value: 5, color: '#ff06a4' },
  { value: 10, color: '#b588ff' },
  { value: 25, color: '#ff9e10' },
  { value: 100, color: '#ff0000' },
  { value: 1000, color: '#ffbf00' },
]

export const getMultiplierValueByIndex = (index: number) =>
  multipliers[index]?.value ?? 0

export const states = [
  'cover',
  'rules',
  'settings',
  'add-money',
  'pull',
  'game-over',
] as const

export type State = (typeof states)[number]

export const images = {
  gamerules: './assets/images/game-rules.svg',
  close: './assets/images/close.svg',
  moneybag: './assets/images/money-bag.svg',
  logo: './assets/images/bullet-logo.svg',
  wrapper: './assets/images/wrapper.png',
  gameOver: './assets/images/compressed/game-over.gif',
  blood: './assets/images/compressed/blood.png',
  you: './assets/images/compressed/you.png',
  died: './assets/images/compressed/died.png',
  100: './assets/images/compressed/100.png',
  deal: './assets/images/deal.svg',
  startgame: './assets/images/start-game.svg',
  wagerhere: './assets/images/wager-here.svg',
  bulletChambe: './assets/images/compressed/bullet-chambe.png',
  body: './assets/images/compressed/body.png',
  pull: './assets/images/pull.svg',
  bottomLine: './assets/images/compressed/bottom-line.png',
  settings: './assets/images/compressed/settings.png',
  bet: './assets/images/compressed/bet.png',
  bullet: './assets/images/compressed/bullet.png',
  multiplier: './assets/images/compressed/multiplier.png',
  balance: './assets/images/compressed/balance.png',
  sliderbar: './assets/images/sliderbar.svg',
  '1000x': './assets/images/compressed/1000x.png',
  '100000$': './assets/images/compressed/100000$.png',
} as const

export const srcImages = Object.values(images)

export const audios = {
  revolverspin: './assets/audios/revolverspin.mp3',
  trigger: './assets/audios/trigger.wav',
  triggerpull: './assets/audios/trigger-pull.wav',
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
