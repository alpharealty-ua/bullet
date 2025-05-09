import { io } from 'socket.io-client'

import { MatchmakerSocketEvents } from '@/socket/matchmaker/matchmaker-socket'
import { ENV } from '@/lib/env'

const GAME_SOCKET_URL = `${ENV.API_URL}/game`
const MATCHMAKER_SOCKET_URL = `${ENV.API_URL}/matchmaker`
const DUEL_SOCKET_URL = `${ENV.API_URL}/duel`

export const gameSocket = io(GAME_SOCKET_URL, {
  path: '/game/socket.io',
  transports: ['websocket'],
  autoConnect: false,
})

export const matchmakerSocket = io(MATCHMAKER_SOCKET_URL, {
  path: '/matchmaker/socket.io',
  transports: ['websocket'],
  autoConnect: false,
})

export const duelSocket = io(DUEL_SOCKET_URL, {
  path: '/duel/socket.io',
  transports: ['websocket'],
  autoConnect: false,
})

export const matchmakerEvents = new MatchmakerSocketEvents(matchmakerSocket)
