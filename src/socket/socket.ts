import { io } from 'socket.io-client'

import { ENV } from '@/lib/env'

const GAME_SOCKET_URL = `${ENV.API_URL}/game`
const MATCHMAKER_SOCKET_URL = `${ENV.API_URL}/matchmaker`
const DUEL_SOCKET_URL = `${ENV.API_URL}/duel`

export const socketGame = io(GAME_SOCKET_URL, {
  path: '/game/socket.io',
  transports: ['websocket'],
  autoConnect: false,
})

export const socketMatchmaker = io(MATCHMAKER_SOCKET_URL, {
  path: '/matchmaker/socket.io',
  transports: ['websocket'],
  autoConnect: false,
})

export const socketDuel = io(DUEL_SOCKET_URL, {
  path: '/duel/socket.io',
  transports: ['websocket'],
  autoConnect: false,
})
