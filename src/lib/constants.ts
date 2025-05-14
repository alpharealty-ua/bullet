import { getItem } from '@/lib/localstorage'

export const MULTIPLIERS = [2, 3, 5, 10, 25, 100, 1000]

export type VariantGame = 'play' | 'watch'

export const IMAGES = {
  logo: '/assets/images/logo.svg',
  wrapper: '/assets/images/wrapper.png',

  footer: '/assets/images/footer.svg',
  bullet: '/assets/images/bullet.png',
  sliderbar: '/assets/images/sliderbar.svg',
  texture: '/assets/images/texture.png',
  enterarena: '/assets/images/enter-arena.svg',
  label: {
    startgame: '/assets/images/start-game.svg',
    wagerhere: '/assets/images/wager-here.svg',
  },
  button: {
    button: '/assets/images/button.svg',
    solo: '/assets/images/solo.svg',
    play: '/assets/images/play.svg',
    pull: '/assets/images/pull.svg',
    deal: '/assets/images/deal.svg',
    duel: '/assets/images/duel.svg',
    watch: '/assets/images/watch.svg',
    gamerules: '/assets/images/game-rules.svg',
    close: '/assets/images/close.svg',
    moneybag: '/assets/images/money-bag.svg',
    leaderboardstar: '/assets/images/leaderboardstar.png',
    settings: '/assets/images/settings.svg',
  },
  gameover: {
    blood: '/assets/images/blood.svg',
    you: '/assets/images/you.svg',
    died: '/assets/images/died.svg',
  },
  revolver: {
    chamber: '/assets/images/compressed/gun-chamber.png',
    body: '/assets/images/compressed/gun-body.png',
    shot1: '/assets/images/shot-revolver-1.png',
    shot2: '/assets/images/shot-revolver-2.png',
    shot3: '/assets/images/shot-revolver-3.png',
  },
  gun: {
    chamber: '/assets/images/gun-chamber-character.png',
    body: '/assets/images/gun-body-character.png',
    shot1: '/assets/images/shot-1.png',
    shot2: '/assets/images/shot-2.png',
    shot3: '/assets/images/shot-3.png',
  },
  character: {
    nubcat: {
      front: '/assets/images/character-nubcat-front.png',
      back: '/assets/images/character-nubcat-back.png',
      hand: '/assets/images/gun-hand-character-nubcat.png',
      finger: '/assets/images/gun-finger-character-nubcat.png',
    },
    mickey: {
      front: '/assets/images/character-mickey-front.png',
      back: '/assets/images/character-mickey-back.png',
      hand: '/assets/images/gun-hand-character-mickey.png',
      finger: '/assets/images/gun-finger-character-mickey.png',
    },
    fatty: {
      front: '/assets/images/character-fatty-front.png',
      back: '/assets/images/character-fatty-back.png',
      hand: '/assets/images/gun-hand-character-fatty.png',
      finger: '/assets/images/gun-finger-character-fatty.png',
    },
    ['anime-1']: {
      front: '/assets/images/character-anime-1-front.png',
      back: '/assets/images/character-anime-1-back.png',
      hand: '/assets/images/gun-hand-character-anime.png',
      finger: '/assets/images/gun-finger-character-anime.png',
    },
    ['anime-2']: {
      front: '/assets/images/character-anime-2-front.png',
      back: '/assets/images/character-anime-2-back.png',
      hand: '/assets/images/gun-hand-character-anime.png',
      finger: '/assets/images/gun-finger-character-anime.png',
    },
    daisy: {
      front: '/assets/images/character-daisy-front.png',
      back: '/assets/images/character-daisy-back.png',
      hand: '/assets/images/gun-hand-character-daisy.png',
      finger: '/assets/images/gun-finger-character-daisy.png',
    },
  },
  flag: {
    usa: '/assets/images/flag-usa.png',
    china: '/assets/images/flag-china.png',
    mexico: '/assets/images/flag-mexico.png',
  },
  trophy: {
    alphaunit: {
      bronze: '/assets/images/trophy-alpha-unit-bronze.png',
      silver: '/assets/images/trophy-alpha-unit-silver.png',
      gold: '/assets/images/trophy-alpha-unit-gold.png',
    },
    nobrackes: {
      bronze: '/assets/images/trophy-no-brackes-bronze.png',
      silver: '/assets/images/trophy-no-brackes-silver.png',
      gold: '/assets/images/trophy-no-brackes-gold.png',
    },
    unmoveableforce: {
      bronze: '/assets/images/trophy-unmoveable-force-bronze.png',
      silver: '/assets/images/trophy-unmoveable-force-silver.png',
      gold: '/assets/images/trophy-unmoveable-force-gold.png',
    },
    deathmechanic: {
      bronze: '/assets/images/trophy-death-mechanic-bronze.png',
      silver: '/assets/images/trophy-death-mechanic-silver.png',
      gold: '/assets/images/trophy-death-mechanic-gold.png',
    },
  },
} as const

export const IMAGE_SRC_LIST = Object.values(IMAGES)

export const TROPHY_IMAGES_SRC_LIST = Object.values(IMAGES.trophy)
  .map((e) => [e.bronze, e.silver, e.gold])
  .flat()

export type TrophyName = keyof typeof IMAGES.trophy

export const trophyDescription = {
  alphaunit: {
    name: 'ALPHA UNIT',
    bronze: {
      image: IMAGES.trophy.alphaunit.bronze,
      description: 'record 5 consecutive wins',
    },
    silber: {
      image: IMAGES.trophy.alphaunit.silver,
      description: 'record 10 consecutive wins',
    },
    gold: {
      image: IMAGES.trophy.alphaunit.gold,
      description: 'record 25 consecutive wins',
    },
  },
  nobrackes: {
    name: 'NO BRAKES',
    bronze: {
      image: IMAGES.trophy.nobrackes.bronze,
      description: 'Play 50 games',
    },
    silber: {
      image: IMAGES.trophy.nobrackes.silver,
      description: 'play 200 games',
    },
    gold: {
      image: IMAGES.trophy.nobrackes.gold,
      description: 'play 500 games',
    },
  },
  unmoveableforce: {
    name: 'UNMOVEABLE FORCE',
    bronze: {
      image: IMAGES.trophy.unmoveableforce.bronze,
      description: 'win one best of three series',
    },
    silber: {
      image: IMAGES.trophy.unmoveableforce.silver,
      description: 'win 5 best of three series in a row',
    },
    gold: {
      image: IMAGES.trophy.unmoveableforce.gold,
      description: 'win 10 best of three series in a row',
    },
  },
  deathmechanic: {
    name: 'DEATH MECHANIC',
    bronze: {
      image: IMAGES.trophy.deathmechanic.bronze,
      description: 'perform 5 perfect shot kills in a row',
    },
    silber: {
      image: IMAGES.trophy.deathmechanic.silver,
      description: 'perform 10 perfect shot kills in a row',
    },
    gold: {
      image: IMAGES.trophy.deathmechanic.gold,
      description: 'perform 25 perfect shot kills in a row',
    },
  },
} satisfies Record<
  TrophyName,
  {
    name: string
    bronze: { image: string; description: string }
    silber: { image: string; description: string }
    gold: { image: string; description: string }
  }
>

export const CHARACTER_LIST = IMAGES.character satisfies Record<
  CharacterName,
  Record<CharacterType, string>
>

export const characterNameList = [
  'nubcat',
  'mickey',
  'fatty',
  'anime-1',
  'anime-2',
  'daisy',
] as const

export type CharacterName = (typeof characterNameList)[number]

export type CharacterType = 'back' | 'front'

export const AUDIOS = {
  bulletTrack: '/assets/audios/bullet-track.mp3',
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
  matchConfirmed: '/assets/audios/match-confirmed.mp3',
  matchCanceled: '/assets/audios/match-canceled.mp3',
  holy: '/assets/audios/holy.mp3',
  bounce: '/assets/audios/bounce.mp3',
  timer: '/assets/audios/timer.mp3',
  negativebeeps: '/assets/audios/negative-beeps.mp3',
} as const

export const SRC_AUDIOS = Object.values(AUDIOS)

export type AudioKeys = keyof typeof AUDIOS

export const SETTINGS = {
  music: 'Toggle music',
  soundEffects: 'Toggle sound effects',
  invertButtons: 'Invert PULL AND DEAL button positions',
  blood: 'Toggles off blood',
} as const

export const DEFAULT_SETTINGS: Record<SettingsKeys, boolean> = {
  music: true,
  soundEffects: true,
  invertButtons: false,
  blood: false,
}

export const settingsEntries = Object.entries(SETTINGS) as [
  SettingsKeys,
  string,
][]

export type SettingsKeys = keyof typeof SETTINGS

export const LANGUAGE_LIST = [
  {
    language: 'usa',
    flag: IMAGES.flag.usa,
  },
  {
    language: 'china',
    flag: IMAGES.flag.china,
  },
  {
    language: 'mexico',
    flag: IMAGES.flag.mexico,
  },
] as const

export type Language = (typeof LANGUAGE_LIST)[number]['language']

export const LOCAL_STORAGE_KEYS = {
  showDebug: 'SHOW_DEBUG',
  maxBet: 'MAX_BET',
  minDuelBet: 'MIN_DUEL_BET',
  duelCoundDown: 'DUEL_COUNTDOWN',
  afkTime: 'AFK_TIME',
  maxRounds: 'MAX_ROUNDS',
  betAmount: 'BET_AMOUNT',
} as const

export type LocalStorageKeys = keyof typeof LOCAL_STORAGE_KEYS

// TODO: TRANSFORM TO OBJECT
export const MAX_BET = Number(getItem('maxBet') ?? 10_000)

export const MIN_DUEL_BET = Number(getItem('minDuelBet') ?? 1_000)

export const DUEL_COUNTDOWN = Number(getItem('duelCoundDown') ?? 5)

export const AFK_TIME = Number(getItem('afkTime') ?? 30_000)

export const BET_AMOUNT = Number(getItem('betAmount') ?? 1000)

export const MAX_ROUNDS = Number(getItem('maxRounds') ?? 10)
