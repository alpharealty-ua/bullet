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

export const states = ['preparation', 'running', 'win', 'game-over'] as const

export type State = (typeof states)[number]

export type FormatGame = 'solo' | 'duel' | 'watch'

// TODO: CHANGE TO UPPERCASE
export const images = {
  gamerules: '/assets/images/game-rules.svg',
  close: '/assets/images/close.svg',
  moneybag: '/assets/images/money-bag.svg',
  logo: '/assets/images/logo.svg',
  wrapper: '/assets/images/wrapper.png',
  gameover: '/assets/images/game-over.gif',
  blood: '/assets/images/blood.svg',
  you: '/assets/images/you.svg',
  died: '/assets/images/died.svg',
  deal: '/assets/images/deal.svg',
  duel: '/assets/images/duel.svg',
  watch: '/assets/images/watch.svg',
  button: '/assets/images/button.svg',
  startgame: '/assets/images/start-game.svg',
  wagerhere: '/assets/images/wager-here.svg',
  gunchamber: '/assets/images/compressed/gun-chamber.png',
  gunbody: '/assets/images/compressed/gun-body.png',
  gunchambercharacter: '/assets/images/gun-chamber-character.png',
  gunbodycharacter: '/assets/images/gun-body-character.png',
  solo: '/assets/images/solo.svg',
  play: '/assets/images/play.svg',
  pull: '/assets/images/pull.svg',
  footer: '/assets/images/footer.svg',
  settings: '/assets/images/settings.svg',
  bullet: '/assets/images/bullet.png',
  sliderbar: '/assets/images/sliderbar.svg',
  '1000x': '/assets/images/compressed/1000x.png',
  duelcharacter1: '/assets/images/character-1.png',
  duelcharacter2: '/assets/images/character-2.png',
  opponent: '/assets/images/opponent.png',
  flagusa: '/assets/images/flag-usa.png',
  flagchina: '/assets/images/flag-china.png',
  flagmexico: '/assets/images/flag-mexico.png',
  texture: '/assets/images/texture.png',
} as const

export const srcImages = Object.values(images)

export const CHARACTER_IMAGES = [images.duelcharacter1, images.duelcharacter2]

export const audios = {
  revolverspin: '/assets/audios/revolverspin.mp3',
  trigger: '/assets/audios/trigger.wav',
  triggerpull: '/assets/audios/trigger-pull.wav',
  spin: '/assets/audios/spin.mp3',
  gunshot: '/assets/audios/gunshot.mp3',
  drumbeat: '/assets/audios/drumbeat.wav',
  mouseclick: '/assets/audios/click.wav',
  chaching: '/assets/audios/chaching.mp3',
  winsound: '/assets/audios/winsound.mp3',
  ready: '/assets/audios/ready.mp3',
  set: '/assets/audios/set.mp3',
  pull: '/assets/audios/pull.mp3',
} as const

export const audiosEntries = Object.entries(audios)

export const INIT_BALANCE = 1000

export const MAX_BET = 1000

const TIME_WIN_AUDIO = 3500
const TIME_ANIMATION_DELAY = 200
const TIME_ANIMATION_DURATION = 500
export const TIME_WIN_INCREASE_NUMBER =
  TIME_WIN_AUDIO - TIME_ANIMATION_DURATION - TIME_ANIMATION_DELAY

export const settings = {
  music: 'Toggle music',
  soundEffects: 'Toggle sound effects',
  invertButtons: 'Invert PULL AND DEAL button positions',
  blood: 'Toggles off blood',
  declineAllDeals: 'Decline all deals',
} as const

export const settingsEntries = Object.entries(settings) as [
  SettingsKeys,
  string,
][]

export type SettingsKeys = keyof typeof settings

export const LANGUAGE_LIST = [
  {
    language: 'usa',
    flag: images.flagusa,
  },
  {
    language: 'china',
    flag: images.flagchina,
  },
  {
    language: 'mexico',
    flag: images.flagmexico,
  },
] as const

export type Language = (typeof LANGUAGE_LIST)[number]['language']
