import { CharacterName } from '@/lib/constants'

export type PingData = {
  ping: number
  jitter: number
  measurements: number
  history: { ping: number; jitter: number; timestamp: number }[]
  sequence: number
}

export type AdditionalPlayerMetadata = {
  username: string
  region: string
  characterName: string
}

type PlayerMetadata = {
  roles: string[]
  userId: string
  betOptions: BetOptions
  matchConfirmationRequired: boolean
} & AdditionalPlayerMetadata

export type JoinMatchmaking = {
  betOptions?: BetOptions
  metadata?: AdditionalPlayerMetadata // Optional: Additional metadata
  matchConfirmationRequired: boolean
}

export type ConfirmMatch = {
  matchId: string // ID of the match to confirm
  // Optional: Bet options for the match
  betOptions?: BetOptions
}

type BetOptions = {
  networkId: string // Blockchain network ID
  coinId: string // Cryptocurrency ID
  betAmount: string // Bet amount
  maxRounds?: number // Maximum number of rounds
}

type MatchFoundMetadata = {
  averagePing: number
  pingDifference: number
  userIds: string[]
  playerMetadata: Record<string, PlayerMetadata>
  betOptions: BetOptions
}

export type MatchFoundResponse = {
  matchId: string // ID of the match
  players: string[] // Array of player IDs
  // Match metadata, including bet options if available
  metadata: MatchFoundMetadata
  confirmationRequired: boolean // Whether confirmation is required
  confirmationTimeoutSeconds: number // Timeout for confirmation in seconds
}

export type MatchConfirmationUpdate = {
  matchId: string // ID of the match
  confirmedPlayers: string[] // Array of player IDs who have confirmed
  totalPlayers: number // Total number of players in the match
  betOptions?: BetOptions
}

export type MatchCancelResponse = {
  unconfirmedPlayers: string[]
  matchId: string
} & (
  | {
      reason: 'confirmation_timeout'
    }
  | {
      reason: 'player_declined'
      declinedBy: string
    }
)

export type MatchmakingStatus =
  | 'not-in-queue'
  | 'connecting'
  | 'searching'
  | 'match-found'
  | 'match-created'

export type ConnectionStatus =
  | 'connected'
  | 'authenticating'
  | 'authenticated'
  | 'disconnected'
  | 'not-authenticated'
  | 'authentication-failed'

export type JoinedMatchmakingResponse = {
  betOptions: BetOptions
  matchConfirmationRequired: boolean
  ping: number
  playerId: string
  queuedAt: string
  status: MatchmakingStatus
  message?: string
}

export type LeftMatchmakingResponse = {
  playerId: string
  status: MatchmakingStatus
}

export type InfoResponse = {
  authenticated: boolean
  description: string
  playersInQueue: 0
  service: string
  status: 'online'
  user: { id: string; roles: string[] }
  version: string
  currentPing?: number
  currentJitter?: number
  measurementsCount?: number
}

export type PingResponse = {
  sequence: number
}

export type PingUpdateResponse = {
  ping: number
  jitter?: number
  measurements?: number
}

export type MatchCreatedResponse = {
  matchId: string
  gameId: string
  players: string[]
  bet: Omit<BetOptions, 'maxRounds'>
  metadata?: any
}

export type DuelGameCreatedResponse = {
  matchId: string
  gameId: string
  players: string[]
  bet: Omit<BetOptions, 'maxRounds'>
  metadata?: any
}

export type Indicator = {
  playerId: string
  confirm: boolean
}

export type Player = {
  id: string // Player ID
  username: string // Player username
}

export type MatchDetails = {
  matchId: string
  pingDifference: number
  averagePing: number
  gameId: string
  opponent: {
    ping: number
    username: string
    region: string
    characterName: CharacterName
  }
}

export type Statistics = {
  playersInQueue: number
  totalMatches: number
  averageWaitTime: number
}

export type StatisticsResponse = Partial<Statistics>

export type Info = {
  playerId: string | null
  ping: number
}
