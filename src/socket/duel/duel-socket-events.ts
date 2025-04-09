import { Socket } from 'socket.io-client'

import { ReadyTakePull } from '@/components/ready-set-pull'
import {
  RoundCurrent,
  PullResult,
  Won,
  Ended,
  Probability,
  RematchRequestResponse,
  RematchCreatedResonse,
  RematchCancelledResponse,
  CountdownUpdateResponse,
  PlayerLeftResponse,
  PlayerDisconnectedResponse,
  GameJoinedResponse,
  RoundCurrentResponse,
  ReadyTakePullResponse,
  PullResultResponse,
  PlayerWonResponse,
  EndedResponse,
  ProbabilityResponse,
  ErrorResponse,
  JoinedResponse,
  RoundStartedResponse,
  BaseDuelPayload,
  StartedResponse,
} from '@/socket/duel/duel-socket.types'
import { notify, SocketEvents } from '@/socket/utils'

export type OnEvents =
  | { type: 'connect'; payload: undefined }
  | { type: 'connect_error'; payload: any }
  | { type: 'disconnect'; payload: undefined }
  | { type: 'game:joined'; payload: JoinedResponse }
  | { type: 'game:reconnected'; payload: undefined }
  | { type: 'game:round_started'; payload: RoundStartedResponse }
  | { type: 'game:round_current'; payload: RoundCurrent }
  | {
      type: 'game:ready'
      payload: ReadyTakePullResponse & { event: ReadyTakePull }
    }
  | {
      type: 'game:take'
      payload: ReadyTakePullResponse & { event: ReadyTakePull }
    }
  | {
      type: 'game:pull'
      payload: ReadyTakePullResponse & { event: ReadyTakePull }
    }
  | { type: 'game:pull_result'; payload: PullResult }
  | { type: 'game:player_won'; payload: Won }
  | { type: 'game:started'; payload: StartedResponse }
  | { type: 'game:ended'; payload: Ended }
  | { type: 'probability'; payload: Probability }
  | { type: 'game:rematch_requested'; payload: RematchRequestResponse }
  | { type: 'game:rematch_created'; payload: RematchCreatedResonse }
  | { type: 'game:rematch_cancelled'; payload: RematchCancelledResponse }
  | { type: 'game:countdown_update'; payload: CountdownUpdateResponse }
  | { type: 'game:player_left'; payload: PlayerLeftResponse }
  | { type: 'game:player_disconnected'; payload: PlayerDisconnectedResponse }
  | {
      type: 'error'
      payload: { event: string; message: string; timestamp: string }
    }

class DuelSocketEvents extends SocketEvents {
  private onEvent: (events: OnEvents) => void = () => {}

  constructor(
    protected socket: Socket,
    private token: string,
    private gameId: string,
    private playerId: string,
  ) {
    super(socket)
  }

  updateEvents(onEvent: (events: OnEvents) => void) {
    this.onEvent = onEvent
  }

  connect() {
    try {
      this.socket.auth = { token: this.token }
      this.socket.connect()
    } catch (error) {
      console.error(`Error connecting to duel game service:`, error)
    }
  }

  disconnect() {
    this.leaveDuelGame()
    notify(`Disconnected from duel game service`, 'info')
    this.socket.disconnect()
  }

  joinDuelGame() {
    const payload: BaseDuelPayload = {
      gameId: this.gameId,
      playerId: this.playerId,
    }

    this.socket.emit('game:join', payload)
  }

  leaveDuelGame() {
    notify(`Leaving duel game ${this.gameId}...`, 'info')

    const payload: BaseDuelPayload = {
      gameId: this.gameId,
      playerId: this.playerId,
    }

    this.socket.emit('game:leave', payload)
  }

  requestRematch = () => {
    notify(`Request rematch`, 'info')

    const payload: BaseDuelPayload = {
      gameId: this.gameId,
      playerId: this.playerId,
    }

    this.socket.emit('game:request_rematch', payload)
  }

  pullTrigger() {
    const payload: BaseDuelPayload = {
      gameId: this.gameId,
      playerId: this.playerId,
    }

    this.socket.emit('game:pull_trigger', payload)
  }

  attachEventListeners() {
    this.dettachEventListeners()

    // TODO: ADD ZOD VALIDATION
    this.on('connect', () => {
      this.onEvent({ type: 'connect', payload: undefined })
    })

    this.on('connect_error', (error) => {
      this.onEvent({ type: 'connect_error', payload: error })
    })

    this.on('disconnect', () => {
      this.onEvent({ type: 'disconnect', payload: undefined })
    })

    this.on('game:joined', (data: GameJoinedResponse) => {
      this.onEvent({ type: 'game:joined', payload: data })
    })

    this.on('game:reconnected', () => {
      this.onEvent({ type: 'game:reconnected', payload: undefined })
    })

    this.on('game:round_started', (data: RoundStartedResponse) => {
      this.onEvent({ type: 'game:round_started', payload: data })
    })

    this.on('game:round_current', (data: RoundCurrentResponse) => {
      this.onEvent({ type: 'game:round_current', payload: data })
    })

    this.on('game:ready', (data: ReadyTakePullResponse) => {
      this.onEvent({ type: 'game:ready', payload: { ...data, event: 'ready' } })
    })

    this.on('game:take', (data: ReadyTakePullResponse) => {
      this.onEvent({ type: 'game:take', payload: { ...data, event: 'take' } })
    })

    this.on('game:pull', (data: ReadyTakePullResponse) => {
      this.onEvent({ type: 'game:pull', payload: { ...data, event: 'pull' } })
    })

    this.on('game:pull_result', (data: PullResultResponse) => {
      this.onEvent({ type: 'game:pull_result', payload: data })
    })

    this.on('game:player_won', (data: PlayerWonResponse) => {
      this.onEvent({ type: 'game:player_won', payload: data })
    })

    this.on('game:started', (data: StartedResponse) => {
      this.onEvent({ type: 'game:started', payload: data })
    })

    this.on('game:ended', (data: EndedResponse) => {
      this.onEvent({ type: 'game:ended', payload: data })
    })

    this.on('game:probability', (data: ProbabilityResponse) => {
      this.onEvent({ type: 'probability', payload: data })
    })

    this.on('game:rematch_requested', (data: RematchRequestResponse) => {
      this.onEvent({ type: 'game:rematch_requested', payload: data })
    })

    this.on('game:rematch_created', (data: RematchCreatedResonse) => {
      this.onEvent({ type: 'game:rematch_created', payload: data })
    })

    this.on('game:rematch_cancelled', (data: RematchCancelledResponse) => {
      this.onEvent({ type: 'game:rematch_cancelled', payload: data })
    })

    this.on('game:countdown_update', (data: CountdownUpdateResponse) => {
      this.onEvent({ type: 'game:countdown_update', payload: data })
    })

    this.on('game:player_left', (data: PlayerLeftResponse) => {
      this.onEvent({ type: 'game:player_left', payload: data })
    })

    this.on('game:player_disconnected', (data: PlayerDisconnectedResponse) => {
      this.onEvent({ type: 'game:player_disconnected', payload: data })
    })

    this.on('error', (error: ErrorResponse) => {
      this.onEvent({ type: 'error', payload: error })
    })
  }
}

export { DuelSocketEvents }
