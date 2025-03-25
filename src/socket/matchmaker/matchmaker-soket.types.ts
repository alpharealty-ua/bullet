export type PingData = {
  ping: number
  jitter: number
  measurements: number
  history: { ping: number; jitter: number; timestamp: number }[]
  sequence: number
}

export type JoinMatchmaking = {
  betOptions?: BetOptions
  metadata?: Record<string, any> // Optional: Additional metadata
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

type PlayerMetadata = {
  betOptions: BetOptions
  matchConfirmationRequired: boolean
  region: string
  roles: string[]
  userId: string
  username: string
}

export type MatchFoundResponse = {
  matchId: string // ID of the match
  players: string[] // Array of player IDs
  // Match metadata, including bet options if available
  metadata: {
    averagePing: number
    pingDifference: number
    userIds: string[]
    playerMetadata: Record<string, PlayerMetadata>
    betOptions: BetOptions
  }
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
  version: '1.0.0'
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

export type DuelGameCreatedResponse = {
  matchId: string // ID of the match
  gameId: string // ID of the created duel game

  // Array of players in the duel game
  players: string[]
  // Bet information
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
  matchId: any
  pingDifference: any
  averagePing: any
  gameId: any
  opponent: { ping: number; username: string; region: string }
}

export type Statistics = {
  playersInQueue: number
  totalMatches: number
  averageWaitTime: number
}

export type ConfirmationTimer = {
  time: number
  urgent: boolean
}

export type Info = {
  playerId: string | null
  ping: number
}
