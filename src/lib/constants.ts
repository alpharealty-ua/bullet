export const MULTIPLIERS = [2, 3, 5, 10, 25, 100, 1000]

export const STATES = [
  'preparation',
  'running',
  'win',
  'game-over',
  'draw',
] as const

export type StateGame = (typeof STATES)[number]

export type FormatGame = 'solo' | 'duel'

export type VariantGame = 'play' | 'watch'

export const IMAGES = {
  gamerules: '/assets/images/game-rules.svg',
  close: '/assets/images/close.svg',
  moneybag: '/assets/images/money-bag.svg',
  logo: '/assets/images/logo.svg',
  wrapper: '/assets/images/wrapper.png',
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
  gunhandcharacternubcat: '/assets/images/gun-hand-character-nubcat.png',
  gunfingercharacternubcat: '/assets/images/gun-finger-character-nubcat.png',
  gunhandcharactermickey: '/assets/images/gun-hand-character-mickey.png',
  gunfingercharactermickey: '/assets/images/gun-finger-character-mickey.png',
  gunhandcharacterfatty: '/assets/images/gun-hand-character-fatty.png',
  gunfingercharacterfatty: '/assets/images/gun-finger-character-fatty.png',
  gunhandcharacteranime: '/assets/images/gun-hand-character-anime.png',
  gunfingercharacteranime: '/assets/images/gun-finger-character-anime.png',
  solo: '/assets/images/solo.svg',
  play: '/assets/images/play.svg',
  pull: '/assets/images/pull.svg',
  footer: '/assets/images/footer.svg',
  settings: '/assets/images/settings.svg',
  bullet: '/assets/images/bullet.png',
  sliderbar: '/assets/images/sliderbar.svg',
  '1000x': '/assets/images/compressed/1000x.png',
  characternubcatfront: '/assets/images/character-nubcat-front.png',
  charactermickeyfront: '/assets/images/character-mickey-front.png',
  characterfattyfront: '/assets/images/character-fatty-front.png',
  characteranime1front: '/assets/images/character-anime-1-front.png',
  characteranime2front: '/assets/images/character-anime-2-front.png',
  characternubcatback: '/assets/images/character-nubcat-back.png',
  charactermickeyback: '/assets/images/character-mickey-back.png',
  characterfattyback: '/assets/images/character-fatty-back.png',
  characteranime1back: '/assets/images/character-anime-1-back.png',
  characteranime2back: '/assets/images/character-anime-2-back.png',
  flagusa: '/assets/images/flag-usa.png',
  flagchina: '/assets/images/flag-china.png',
  flagmexico: '/assets/images/flag-mexico.png',
  texture: '/assets/images/texture.png',
  shot1: '/assets/images/shot-1.png',
  shot2: '/assets/images/shot-2.png',
  shot3: '/assets/images/shot-3.png',
  shotrevolver1: '/assets/images/shot-revolver-1.png',
  shotrevolver2: '/assets/images/shot-revolver-2.png',
  shotrevolver3: '/assets/images/shot-revolver-3.png',
  leaderboardstar: '/assets/images/leaderboardstar.png',
  enterarena: '/assets/images/enter-arena.svg',
} as const

export const SRC_IMAGES = Object.values(IMAGES)

export const CHARACTER_LIST = {
  nubcat: {
    back: IMAGES.characternubcatback,
    front: IMAGES.characternubcatfront,
  },
  mickey: {
    back: IMAGES.charactermickeyback,
    front: IMAGES.charactermickeyfront,
  },
  fatty: {
    back: IMAGES.characterfattyback,
    front: IMAGES.characterfattyfront,
  },
  ['anime-1']: {
    back: IMAGES.characteranime1back,
    front: IMAGES.characteranime1front,
  },
  ['anime-2']: {
    back: IMAGES.characteranime2back,
    front: IMAGES.characteranime2front,
  },
} satisfies Record<CharacterName, Record<CharacterType, string>>

export type CharacterName =
  | 'nubcat'
  | 'mickey'
  | 'fatty'
  | 'anime-1'
  | 'anime-2'

export type CharacterType = 'back' | 'front'

export const CHARACTER_NAMES = Object.keys(CHARACTER_LIST) as CharacterName[]

export const DISABLED_CHARACTER_NAMES: CharacterName[] = ['anime-2']

export const AUDIOS = {
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
  matchFound: '/assets/audios/match-found.mp3',
  // TODO: DOWNLOAD TO PROJECT
  matchConfirmed:
    'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  matchCanceled: '/assets/audios/match-canceled.mp3',
} as const

export const audiosEntries = Object.entries(AUDIOS)

export const MAX_BET = 10_000

const TIME_WIN_AUDIO = 3500
const TIME_ANIMATION_DELAY = 200
const TIME_ANIMATION_DURATION = 500
export const TIME_WIN_INCREASE_NUMBER =
  TIME_WIN_AUDIO - TIME_ANIMATION_DURATION - TIME_ANIMATION_DELAY

export const SETTINGS = {
  music: 'Toggle music',
  soundEffects: 'Toggle sound effects',
  invertButtons: 'Invert PULL AND DEAL button positions',
  blood: 'Toggles off blood',
  declineAllDeals: 'Decline all deals',
  autoConnect: 'Auto connect to matchmaker',
} as const

export const DEFAULT_SETTINGS: Record<keyof typeof SETTINGS, boolean> = {
  music: true,
  soundEffects: true,
  invertButtons: false,
  blood: false,
  declineAllDeals: false,
  autoConnect: true,
}

export const settingsEntries = Object.entries(SETTINGS) as [
  SettingsKeys,
  string,
][]

export type SettingsKeys = keyof typeof SETTINGS

export const LANGUAGE_LIST = [
  {
    language: 'usa',
    flag: IMAGES.flagusa,
  },
  {
    language: 'china',
    flag: IMAGES.flagchina,
  },
  {
    language: 'mexico',
    flag: IMAGES.flagmexico,
  },
] as const

export type Language = (typeof LANGUAGE_LIST)[number]['language']

export const LOCAL_STORAGE_KEYS = {
  token: 'TOKEN',
  endTime: 'END_TIME',
  showDebug: 'SHOW_DEBUG',
} as const

export type LocalStorageKeys = keyof typeof LOCAL_STORAGE_KEYS

export const ADD_MONEY = 5000

export const MIN_DUEL_BET = 1000

export const START_GAME_COUNTDOWN = 5
