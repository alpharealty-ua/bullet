interface Game {
  id: string
  status: 'waiting' | 'in_progress' | 'completed'
  players: Player[]
  currentRound: number
  rounds: Round[]
  createdAt: string
  updatedAt: string
}
interface Player {
  id: string
  username: string
  status?: 'eliminated' | 'alive'
}
interface Round {
  number: number
  playerActions: {
    [playerId: string]: {
      timestamp: string
      fired: boolean
    }
  }
  winner?: Player
}
export interface GameJoinedResponse {
  gameId: string
  game: Game
  message: string
}
export interface PullResultResponse {
  playerId: string
  gameId: string
  fired: boolean
  isFirstPlayerToPull: boolean
  message: string
  index: number
  probability: number
}
export interface PlayerWonResponse {
  gameId: string
  message: string
  playerId: string
}
export interface StartedResponse {
  game: Game
  gameId: string
  message: string
}
export interface EndedResponse {
  gameId: string
  message: string
  winner?: { id: string }
}
export interface ProbabilityResponse {
  gameId: string
  probability: number
  index: number
  timestamp: string
}
export interface RematchRequestResponse {
  gameId: string
  playerId: string
  message: string
}
export interface RematchCreatedResonse {
  originalGameId: string
  rematchGameId: string
  rematchGame: Game
  requestedBy: string
  message: string
  countdown: number
}
export interface RematchCancelledResponse {
  gameId: string
  playerId: string
  reason: string
  message: string
}
export interface CountdownUpdateResponse {
  gameId: string
  remainingSeconds: number
  message: string
}
export interface PlayerLeftResponse {
  gameId: string
  leavingPlayerId: string
  winner?: Player
  message: string
}
export interface PlayerDisconnectedResponse {
  gameId: string
  disconnectedPlayerId: string
  winner: Player
  message: string
}
export interface RoundStartedResponse {
  gameId: string
  roundNumber: number
  players: Player
}
export interface RoundCurrentResponse {
  gameId: string
  roundNumber: number
  round: Round
  message: string
}
export interface ReadyTakePullResponse {
  gameId: string
  roundNumber: number
  message: string
  timestamp: string
}

export interface ErrorResponse {
  event: string
  message: string
  timestamp: string
}

export interface JoinedResponse {
  game: Game
  gameId: string
  message: string
}

export type PullResult = PullResultResponse
export type Probability = ProbabilityResponse
export type Won = PlayerWonResponse
export type Ended = EndedResponse
export type RoundCurrent = RoundCurrentResponse

export interface BaseDuelPayload {
  gameId: string
  playerId: string
}
