import { getItem } from './lib/localstorage'
import { io } from 'socket.io-client'

const SOCKET_URL = 'https://api-dev.bullet.game' // ENV.API_URL

const socket = io(SOCKET_URL, {
  path: '/game/socket.io',
  autoConnect: true,
  extraHeaders: {
    Authorization: `Bearer ${getItem('token')}`,
  },
})

socket.on('connect', () => {
  console.log('connect')
})

socket.on('disconnect', () => {
  console.log('disconnect')
})
