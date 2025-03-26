import { io } from 'socket.io-client'

import { ENV } from '@/lib/env'

const SOCKET_GAME_URL = `${ENV.API_URL}/game`
const SOCKET_MATCHMAKER_URL = `${ENV.API_URL}/matchmaker`
const SOCKET_DUEL_URL = `${ENV.API_URL}/duel`

export const socketGame = io(SOCKET_GAME_URL, {
  path: '/game/socket.io',
  transports: ['websocket'],
  autoConnect: false,
})

export const socketMatchmaker = io(SOCKET_MATCHMAKER_URL, {
  path: '/matchmaker/socket.io',
  transports: ['websocket'],
  autoConnect: false,
})

export const socketDuel = io(SOCKET_DUEL_URL, {
  path: '/duel/socket.io',
  transports: ['websocket'],
  autoConnect: false,
})
