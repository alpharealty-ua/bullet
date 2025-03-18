import { io } from 'socket.io-client'

import { ENV } from '@/lib/env'

const SOCKET_URL = `${ENV.API_URL}/game` // https://api-dev.bullet.game

export const socket = io(SOCKET_URL, {
  path: '/game/socket.io',
  transports: ['websocket'],
  autoConnect: false,
})
