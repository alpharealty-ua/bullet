import { toast } from 'react-toastify'
import { socketDuel } from '@/socket//socket'
import { showCustomAlert } from '@/socket/utils'

class GameSocket {
  socket = socketDuel
  currentGameId: null | string = null
  inDuelGame = false
  currentGame: any
  gameStatus: string = ''
  opponent: any
  currentRound: number = 0
  betOptions: any
  rematchRequested: boolean = true
  playerId: string | null = null
  eventListener: (() => any)[] = []

  constructor(public token: string) {}

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
    })

    this.on('connect_error', (error) => {
      console.error(`Error connecting to duel game service:`, error)
    })

    this.on('disconnect', () => {
      console.log(`Disconnected from duel game service`)
      this.inDuelGame = false
    })

    // Game joined event
    this.on('game:joined', (data: any) => {
      console.log(`Joined duel game ${data.gameId}`)
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

    // Current round information
    this.on('game:round_current', (data: any) => {
      console.log(`Current round: ${data.roundNumber}`)
      this.currentRound = data.roundNumber
    })

    // Ready phase
    this.on('game:ready', (data: any) => {
      console.log(`Round ${data.roundNumber}: READY...`)
    })

    // Take phase
    this.on('game:take', (data: any) => {
      console.log(`Round ${data.roundNumber}: TAKE...`)
    })

    // Pull phase
    this.on('game:pull', (data: any) => {
      console.log(`Round ${data.roundNumber}: PULL!`)
    })

    // Pull result
    this.on('game:pull_result', (data: any) => {
      if (data.playerId === this.playerId) {
        if (data.fired) {
          console.log(`I pulled the trigger and it FIRED!`)
        } else {
          console.log(`I pulled the trigger but it didn't fire.`)
        }
      } else {
        if (data.fired) {
          console.log(`Opponent pulled the trigger and it FIRED!`)
        } else {
          console.log(`Opponent pulled the trigger but it didn't fire.`)
        }
      }

      if (data.isFirstPlayerToPull) {
        console.log(
          `${data.playerId === this.playerId ? 'I was' : 'Opponent was'} the first to pull!`,
        )
      }
    })

    // Player won round
    this.on('game:player_won', (data: any) => {
      if (data.playerId === this.playerId) {
        console.log(`I won the round!`)
      } else {
        console.log(`Opponent won the round.`)
      }
    })

    // Game ended
    this.on('game:ended', (data: any) => {
      console.log(`Game ended.`)
      this.gameStatus = 'completed'

      if (data.winner) {
        if (data.winner.id === this.playerId) {
          console.log(`I WON THE GAME!`)
          console.log(
            `Received ${parseFloat(this.betOptions.betAmount) * 2} ${this.betOptions.coinId}`,
          )
        } else {
          console.log(`I lost the game.`)
        }
      } else {
        console.log(`Game ended with no winner.`)
      }

      // Request a rematch after a short delay
      setTimeout(
        () => {
          this.requestRematch()
        },
        1000 + Math.random() * 1000,
      )
    })

    // Probability update
    this.on('game:probability', (data: any) => {
      // console.log(`Probability update: ${data.probability}`)
    })

    // Rematch requested
    this.on('game:rematch_requested', (data: any) => {
      console.log(
        `${data.playerId === this.playerId ? 'I' : 'Opponent'} requested a rematch.`,
      )
    })

    // Rematch created
    this.on('game:rematch_created', (data: any) => {
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
    this.on('game:rematch_cancelled', (data: any) => {
      console.log(`Rematch cancelled. Reason: ${data.reason}`)
      this.rematchRequested = false
    })

    // Countdown update
    this.on('game:countdown_update', (data: any) => {
      console.log(`Countdown: ${data.remainingSeconds} seconds`)
    })

    // Player left
    this.on('game:player_left', (data: any) => {
      console.log(`Player ${data.leavingPlayerId} left the game.`)

      if (data.winner && data.winner.id === this.playerId) {
        console.log(`I won by forfeit!`)
      }
    })

    // Player disconnected
    this.on('game:player_disconnected', (data: any) => {
      console.log(`Player ${data.disconnectedPlayerId} disconnected.`)

      if (data.winner && data.winner.id === this.playerId) {
        console.log(`I won by disconnection!`)
      }
    })

    // Error event
    this.on('error', (error) => {
      console.error(`Game error:`, error)
    })
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

  joinDuelGame(gameId: string, playerId: string) {
    console.log(`Joining duel game ${gameId}...`)

    // Store the game ID
    this.currentGameId = gameId
    this.playerId = playerId

    this.socket.emit('game:join', {
      gameId: gameId,
    })
  }

  pullTrigger() {
    if (!this.socket || !this.inDuelGame || !this.currentGameId) {
      return
    }

    this.socket.emit('game:pull_trigger', {
      gameId: this.currentGameId,
    })
  }

  requestRematch() {
    if (
      !this.socket ||
      !this.currentGameId ||
      this.gameStatus !== 'completed'
    ) {
      toast.error(`Cannot request rematch: game not completed`)
      return
    }

    if (this.rematchRequested) {
      toast.error(`Already requested a rematch`)
      return
    }

    console.log(`Requesting a rematch...`)

    this.socket.emit('game:request_rematch', {
      gameId: this.currentGameId,
    })

    this.rematchRequested = true
    return true
  }

  leaveDuelGame() {
    if (!this.socket || !this.currentGameId) {
      showCustomAlert('Cannot leave game: not in a duel game', 'warning')
      return
    }

    showCustomAlert(`Leaving duel game ${this.currentGameId}...`, 'info')

    this.socket.emit('game:leave', {
      gameId: this.currentGameId,
    })

    return true
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
