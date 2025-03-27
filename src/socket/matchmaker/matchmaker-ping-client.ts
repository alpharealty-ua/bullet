/**
 * Matchmaker Ping Client
 *
 * A small client library for handling ping measurements with the Bullet Game Matchmaker service.
 * This library provides utilities to track and display detailed ping metrics.
 */

import { Socket } from 'socket.io-client'

import {
  PingResponse,
  PingUpdateResponse,
} from '@/socket/matchmaker/matchmaker-soket.types'

class MatchmakerPingClient {
  socket: Socket
  options: Record<string, any>
  pingHistory: { ping: number; jitter: number; timestamp: number }[]
  lastSequence: number
  currentPing: number
  currentJitter: number
  measurementsCount: number
  eventListener: (() => any)[] = []

  constructor(socket: Socket, options = {}) {
    this.socket = socket
    this.options = {
      debug: false,
      onPingUpdate: null,
      pingHistorySize: 20,
      ...options,
    }

    this.pingHistory = []
    this.lastSequence = 0
    this.currentPing = 0
    this.currentJitter = 0
    this.measurementsCount = 0

    this.attachEventListeners()
  }

  attachEventListeners() {
    this.on('ping', (data: PingResponse) => {
      this.lastSequence = data.sequence
      this.log(`Received ping request (sequence: ${data.sequence})`)
      this.socket.emit('pong', data)
    })
    this.on('pingUpdate', (data: PingUpdateResponse) => {
      this.currentPing = data.ping
      this.currentJitter = data.jitter || 0
      this.measurementsCount = data.measurements || 0

      this.updatePingHistory(this.currentPing, this.currentJitter)

      this.log(
        `Ping updated: ${data.ping}ms (jitter: ${data.jitter}ms, measurements: ${data.measurements})`,
      )

      // Call the callback if provided
      if (typeof this.options.onPingUpdate === 'function') {
        this.options.onPingUpdate({
          ping: data.ping,
          jitter: data.jitter,
          measurements: data.measurements,
          history: this.getPingHistory(),
          sequence: this.lastSequence,
        })
      }
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
      this.off(event, handler)
    })
  }

  off<T>(event: string, handler: (...args: T[]) => void) {
    this.socket.off(event, handler)
  }

  updatePingHistory(ping: number, jitter: number) {
    const timestamp = Date.now()
    this.pingHistory.push({ ping, jitter, timestamp })

    if (this.pingHistory.length > this.options.pingHistorySize) {
      this.pingHistory.shift()
    }
  }

  getPingHistory() {
    return [...this.pingHistory]
  }

  getPingStats() {
    return {
      currentPing: this.currentPing,
      currentJitter: this.currentJitter,
      measurements: this.measurementsCount,
      sequence: this.lastSequence,
      history: this.getPingHistory(),
      averagePing: this.calculateAveragePing(),
    }
  }

  calculateAveragePing() {
    if (this.pingHistory.length === 0) {
      return 0
    }

    const sum = this.pingHistory.reduce((acc, entry) => acc + entry.ping, 0)
    return Math.round(sum / this.pingHistory.length)
  }

  isPingAcceptable(threshold = 500) {
    return this.currentPing <= threshold
  }

  getPingQuality() {
    if (this.currentPing < 50) return 'excellent'
    if (this.currentPing < 100) return 'good'
    if (this.currentPing < 200) return 'fair'
    return 'poor'
  }

  log(message: string) {
    if (this.options.debug) {
      console.log(`[MatchmakerPing] ${message}`)
    }
  }
}

export { MatchmakerPingClient }
