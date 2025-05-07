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
  characterName: CharacterName
}

type PlayerMetadata = {
  roles: string[]
  userId: string
  betOptions: BetOptions
  matchConfirmationRequired: boolean
} & AdditionalPlayerMetadata

export type JoinMatchmaking = {
  betOptions?: BetOptions
  metadata?: AdditionalPlayerMetadata
  matchConfirmationRequired: boolean
}

export type ConfirmMatch = {
  matchId: string
  betOptions?: BetOptions
}

type BetOptions = {
  networkId: string
  coinId: string
  betAmount: string
  maxRounds?: number
}

type MatchFoundMetadata = {
  averagePing: number
  pingDifference: number
  userIds: string[]
  playerMetadata: Record<string, PlayerMetadata>
  betOptions: BetOptions
}

export type MatchFoundResponse = {
  matchId: string
  players: string[]
  metadata: MatchFoundMetadata
  confirmationRequired: boolean
  confirmationTimeoutSeconds: number
}

export type MatchConfirmationUpdate = {
  matchId: string
  confirmedPlayers: string[]
  totalPlayers: number
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
  players: string[]
  confirmationRequired: string
  metadata?: {
    averagePing?: number
    betOptions: Omit<BetOptions, 'maxRounds'>
    confirmationRequired: boolean
    confirmationTimeoutSeconds?: string
    pingDifference?: number
    playerMetadata: Record<string, PlayerMetadata>
  }
}

export type DuelGameCreatedResponse = {
  matchId: string
  gameId: string
  players: string[]
  bet: Omit<BetOptions, 'maxRounds'>
  metadata?: Record<string, unknown>
}

export type ErrorResponse = {
  event: string
  message: string
  timestamp: string
}

export type MatchDetails = {
  matchId: string
  pingDifference: number
  averagePing: number
  opponent: AdditionalPlayerMetadata
}

export type Statistics = {
  playersInQueue: number
  totalMatches: number
  averageWaitTime: number
}

export type StatisticsResponse = Partial<Statistics>
