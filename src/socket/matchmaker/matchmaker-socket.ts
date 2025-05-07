import { Socket } from 'socket.io-client'

import {
  MatchCreatedResponse,
  InfoResponse,
  JoinedMatchmakingResponse,
  LeftMatchmakingResponse,
  MatchCancelResponse,
  MatchConfirmationUpdate,
  MatchFoundResponse,
  PingData,
  StatisticsResponse,
  DuelGameCreatedResponse,
  JoinMatchmaking,
  ErrorResponse,
} from '@/socket/matchmaker/matchmaker-soket.types'
import { MatchmakerPingClient } from '@/socket/matchmaker/matchmaker-ping-client'
import { notify, SocketEvents } from '@/socket/utils'
import { CharacterName } from '@/lib/constants'

type OnEvents =
  | { type: 'connect'; payload: undefined }
  | { type: 'connect_error'; payload: { message: string } }
  | { type: 'disconnect'; payload: undefined }
  | { type: 'info'; payload: InfoResponse }
  | { type: 'pingData'; payload: PingData }
  | { type: 'joinedMatchmaking'; payload: JoinedMatchmakingResponse }
  | { type: 'leftMatchmaking'; payload: LeftMatchmakingResponse }
  | { type: 'matchFound'; payload: MatchFoundResponse }
  | { type: 'matchConfirmationUpdate'; payload: MatchConfirmationUpdate }
  | { type: 'matchCanceled'; payload: MatchCancelResponse }
  | { type: 'stats'; payload: StatisticsResponse }
  | { type: 'matchCreated'; payload: MatchCreatedResponse }
  | { type: 'duelGameCreated'; payload: DuelGameCreatedResponse }
  | {
      type: 'error'
      payload: ErrorResponse
    }

class MatchmakerSocketEvents extends SocketEvents {
  private onEvent: (events: OnEvents) => void = () => {}
  private matchmakerPingClient: MatchmakerPingClient | null = null

  constructor(
    protected socket: Socket,
    public token: string,
    public metadata: {
      username: string
      characterName: CharacterName
      region: string
    },
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
      this.attachEventListeners()
    } catch (error) {
      console.error(`Error connecting to duel game service:`, error)
    }
  }

  disconnect() {
    this.socket.disconnect()
    this.dettachEventListeners()
  }

  attachEventListeners() {
    this.dettachEventListeners()

    this.matchmakerPingClient = new MatchmakerPingClient(this.socket, {
      onPingUpdate: (data: PingData) => {
        this.onEvent({ type: 'pingData', payload: data })
      },
    })

    this.on('connect', () => {
      this.onEvent({ type: 'connect', payload: undefined })
    })
    // TODO: NOT CALL IF UNMOUNT
    this.on('disconnect', () => {
      notify(`Disconnected from matchmaker service`, 'info')
      this.onEvent({ type: 'disconnect', payload: undefined })
    })
    this.on('connect_error', (data: { message: string }) => {
      this.onEvent({ type: 'connect_error', payload: data })
    })
    this.on('info', (data: InfoResponse) => {
      this.onEvent({ type: 'info', payload: data })
    })
    this.on('error', (data: ErrorResponse) => {
      this.onEvent({ type: 'error', payload: data })
    })
    this.on('joinedMatchmaking', (data: JoinedMatchmakingResponse) => {
      this.onEvent({ type: 'joinedMatchmaking', payload: data })
    })
    this.on('leftMatchmaking', (data: LeftMatchmakingResponse) => {
      this.onEvent({ type: 'leftMatchmaking', payload: data })
    })
    this.on('matchFound', (data: MatchFoundResponse) => {
      this.onEvent({ type: 'matchFound', payload: data })
    })
    this.on('matchConfirmationUpdate', (data: MatchConfirmationUpdate) => {
      this.onEvent({ type: 'matchConfirmationUpdate', payload: data })
    })
    this.on('matchCanceled', (data: MatchCancelResponse) => {
      this.onEvent({ type: 'matchCanceled', payload: data })
    })
    this.on('matchCreated', (data: MatchCreatedResponse) => {
      this.onEvent({ type: 'matchCreated', payload: data })
    })
    this.on('duelGameCreated', (data: DuelGameCreatedResponse) => {
      this.onEvent({ type: 'duelGameCreated', payload: data })
    })
    this.on('stats', (data: StatisticsResponse) => {
      this.onEvent({ type: 'stats', payload: data })
    })
  }

  dettachEventListeners() {
    super.dettachEventListeners()

    this.matchmakerPingClient?.dettachEventListeners()
  }

  joinMatchmaking(maxRounds = 10) {
    const payload: JoinMatchmaking = {
      betOptions: {
        networkId: 'local',
        coinId: 'usd',
        betAmount: '100000',
        maxRounds,
      },
      metadata: {
        username: this.metadata.username,
        characterName: this.metadata.characterName,
        region: this.metadata.region,
      },
      matchConfirmationRequired: false,
    }

    this.socket.emit('joinMatchmakingWithBet', payload)
  }

  leaveMatchmaking() {
    this.socket.emit('leaveMatchmaking')
  }

  confirmMatch(matchId: string) {
    this.socket.emit('confirmMatch', { matchId })
  }

  declineMatch(matchId: string) {
    this.socket.emit('declineMatch', { matchId })
  }

  getStats() {
    this.socket.emit('getStats')
  }
}

export { MatchmakerSocketEvents, type OnEvents }
