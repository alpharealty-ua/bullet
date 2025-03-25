import { io } from 'socket.io-client'

import { ENV } from '@/lib/env'

const SOCKET_GAME_URL = `${ENV.API_URL}/game`
const SOCKET_MATCHMAKER_URL = `${ENV.API_URL}/matchmaker`

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
