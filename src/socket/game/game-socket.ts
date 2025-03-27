import { socketDuel } from '@/socket/socket'
import { showCustomAlert } from '@/socket/utils'
import { ReadyTakePull } from '@/components/ready-set-pull'

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

interface GameJoinedResponse {
  gameId: string
  game: Game
  message: string
}

interface PullResultResponse {
  playerId: string
  fired: boolean
  isFirstPlayerToPull: boolean
}

interface PlayerWonResponse {
  gameId: string
  message: string
  playerId: string
}

interface EndedResponse {
  gameId: string
  message: string
  winner?: { id: string }
}
interface ProbabilityResponse {
  gameId: string
  probability: number
  index: number
  timestamp: string
}
interface RematchRequestResponse {
  gameId: string
  playerId: string
  message: string
}
interface RematchCreatedResonse {
  originalGameId: string
  rematchGameId: string
  rematchGame: Game
  requestedBy: string
  message: string
  countdown: number
}

interface RematchCancelledResponse {
  gameId: string
  playerId: string
  reason: string
  message: string
}
interface CountdownUpdateResponse {
  gameId: string
  remainingSeconds: number
  message: string
}
interface PlayerLeftResponse {
  gameId: string
  leavingPlayerId: string
  winner?: Player
  message: string
}
interface PlayerDisconnectedResponse {
  gameId: string
  disconnectedPlayerId: string
  winner: Player
  message: string
}

type PullResult = PullResultResponse
type Probability = ProbabilityResponse
type Won = PlayerWonResponse
type Ended = EndedResponse

class GameSocket {
  socket = socketDuel
  // currentGameId: null | string = null
  inDuelGame = false
  currentGame: any
  gameStatus: string = ''
  opponent: any
  currentRound: number = 0
  betOptions: any
  rematchRequested: boolean = true
  eventListener: (() => any)[] = []

  constructor(
    public token: string,
    public playerId: string,
    public currentGameId: string,
    public events: {
      onPullResult: (value: PullResult) => void
      onProbability: (value: Probability) => void
      onReadyTakePull: (value: ReadyTakePull) => void
      onPlayerWon: (value: Won) => void
      onEnded: (value: Ended) => void
      onRoundCurrent: (value: any) => void
    },
  ) {}

  connect() {
    try {
      // Connect to the duel game service
      this.socket.auth = { token: this.token }
      this.socket.connect()

      // Set up game event handlers
      this.attachEventListeners()
    } catch (error) {
      console.error(`Error connecting to duel game service:`, error)
    }
  }

  attachEventListeners() {
    this.dettachEventListeners()

    // Handle connection events
    this.on('connect', () => {
      console.log(`Connected to duel game service`)
      this.joinDuelGame()
    })

    this.on('connect_error', (error) => {
      console.error(`Error connecting to duel game service:`, error)
    })

    this.on('disconnect', () => {
      console.log(`Disconnected from duel game service`)
      this.inDuelGame = false
    })

    // Game joined event
    this.on('game:joined', (data: GameJoinedResponse) => {
      this.inDuelGame = true
      this.currentGame = data.game
      this.gameStatus = data.game.status

      // Find opponent
      this.opponent = data.game.players.find((p: any) => p.id !== this.playerId)
      if (this.opponent) {
        console.log(`Playing against ${this.opponent.username}`)
      }

      console.log(`Game status: ${this.gameStatus}`)
    })

    // Game reconnected event
    this.on('game:reconnected', (data: any) => {
      console.log(`Reconnected to duel game ${data.gameId}`)
      this.inDuelGame = true
      this.currentGame = data.game
      this.gameStatus = data.game.status

      console.log(`Game status: ${this.gameStatus}`)
    })

    interface RoundCurrentResponse {
      gameId: string
      roundNumber: number
      round: Round
      message: string
    }

    // Current round information
    this.on('game:round_current', (data: RoundCurrentResponse) => {
      this.events.onRoundCurrent(data)
      console.log(`Current round: ${data.roundNumber}`)
      this.currentRound = data.roundNumber
    })

    interface ReadyTakePullResponse {
      gameId: string
      roundNumber: number
      message: string
      timestamp: string
    }

    // Ready phase
    this.on('game:ready', (_: ReadyTakePullResponse) => {
      this.events.onReadyTakePull('ready')
    })

    // Take phase
    this.on('game:take', (_: ReadyTakePullResponse) => {
      this.events.onReadyTakePull('take')
    })

    // Pull phase
    this.on('game:pull', (_: ReadyTakePullResponse) => {
      this.events.onReadyTakePull('pull')
    })

    // Pull result
    this.on('game:pull_result', (data: any) => {
      const result = {
        playerId: data.playerId,
        fired: data.fired,
        isFirstPlayerToPull: data.isFirstPlayerToPull,
      }
      this.events.onPullResult(result)
    })

    // Player won round
    this.on('game:player_won', (data: PlayerWonResponse) => {
      this.events.onPlayerWon(data)
    })

    // Game ended
    this.on('game:ended', (data: EndedResponse) => {
      this.gameStatus = 'completed'

      this.events.onEnded(data)
    })

    // Probability update
    this.on('game:probability', (data: ProbabilityResponse) => {
      const propability: Probability = {
        index: data.index,
        probability: data.probability,
        gameId: data.gameId,
        timestamp: data.timestamp,
      }

      this.events.onProbability(propability)
    })

    // Rematch requested
    this.on('game:rematch_requested', (data: RematchRequestResponse) => {
      console.log(
        `${data.playerId === this.playerId ? 'I' : 'Opponent'} requested a rematch.`,
      )
    })

    // Rematch created
    this.on('game:rematch_created', (data: RematchCreatedResonse) => {
      console.log(`Rematch created! New game ID: ${data.rematchGameId}`)
      console.log(`Countdown: ${data.countdown} seconds`)

      // Update game information
      this.currentGameId = data.rematchGameId
      this.currentGame = data.rematchGame
      this.gameStatus = data.rematchGame.status
      this.currentRound = 0
      this.rematchRequested = false
    })

    // Rematch cancelled
    this.on('game:rematch_cancelled', (data: RematchCancelledResponse) => {
      console.log(`Rematch cancelled. Reason: ${data.reason}`)
      this.rematchRequested = false
    })

    // Countdown update
    this.on('game:countdown_update', (data: CountdownUpdateResponse) => {
      console.log(`Countdown: ${data.remainingSeconds} seconds`)
    })

    // Player left
    this.on('game:player_left', (data: PlayerLeftResponse) => {
      console.log(`Player ${data.leavingPlayerId} left the game.`)

      if (data.winner && data.winner.id === this.playerId) {
        console.log(`I won by forfeit!`)
      }
    })

    // Player disconnected
    this.on('game:player_disconnected', (data: PlayerDisconnectedResponse) => {
      console.log(`Player ${data.disconnectedPlayerId} disconnected.`)

      if (data.winner && data.winner.id === this.playerId) {
        console.log(`I won by disconnection!`)
      }
    })

    // Error event
    this.on(
      'error',
      (error: { event: string; message: string; timestamp: string }) => {
        console.error(`Game error:`, error.message)
      },
    )
  }

  dettachEventListeners() {
    let off = null
    while ((off = this.eventListener.pop())) {
      off()
    }
  }

  on<T>(event: string, handler: (...args: T[]) => void) {
    this.socket.on(event, handler)

    this.eventListener.push(() => {
      this.socket.off(event, handler)
    })
  }

  off<T>(event: string, handler: (...args: T[]) => void) {
    this.socket.off(event, handler)
  }

  joinDuelGame() {
    type JoinPayload = { gameId: string; playerId: string }

    const payload: JoinPayload = {
      gameId: this.currentGameId,
      playerId: this.playerId,
    }

    this.socket.emit('game:join', payload)
  }

  pullTrigger() {
    if (!this.socket || !this.inDuelGame || !this.currentGameId) {
      return
    }

    type PullTriggerPayload = { gameId: string; playerId: string }

    const payload: PullTriggerPayload = {
      gameId: this.currentGameId,
      playerId: this.playerId,
    }

    this.socket.emit('game:pull_trigger', payload)
  }

  requestRematch() {
    type RequestRematch = { gameId: string; playerId: string }

    const payload: RequestRematch = {
      gameId: this.currentGameId,
      playerId: this.playerId,
    }

    this.socket.emit('game:request_rematch', payload)
  }

  leaveDuelGame() {
    showCustomAlert(`Leaving duel game ${this.currentGameId}...`, 'info')

    type LeaveRematch = { gameId: string; playerId: string }

    const payload: LeaveRematch = {
      gameId: this.currentGameId,
      playerId: this.playerId,
    }

    this.socket.emit('game:leave', payload)
  }

  disconnect() {
    if (this.inDuelGame && this.currentGameId) {
      this.leaveDuelGame()
    }

    this.socket.disconnect()
    this.inDuelGame = false
    showCustomAlert(`Disconnected from duel game service`, 'info')
  }
}

export { GameSocket }
