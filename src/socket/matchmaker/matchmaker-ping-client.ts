/**
 * Matchmaker Ping Client
 *
 * A small client library for handling ping measurements with the Bullet Game Matchmaker service.
 * This library provides utilities to track and display detailed ping metrics.
 */

import { Socket } from 'socket.io-client'

import { wait } from '@/lib/utils'

export class MatchmakerPingClient {
  socket: Socket
  options: Record<string, any>
  pingHistory: { ping: number; jitter: number; timestamp: number }[]
  lastSequence: number
  currentPing: number
  currentJitter: number
  measurementsCount: number
  eventListener: ((...args: any[]) => any)[] = []

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
    const delay = [0] // , 25, 50, 75, 100, 125, 150
    let i = 0

    const ping = async (data: any) => {
      this.lastSequence = data.sequence
      this.log(`Received ping request (sequence: ${data.sequence})`)
      await wait(delay[i++ % delay.length])
      // Send pong response with the same data
      this.socket.emit('pong', data)
    }

    const pingUpdate = (data: any) => {
      this.currentPing = data.ping
      this.currentJitter = data.jitter || 0
      this.measurementsCount = data.measurements || 0

      // Update ping history
      this.updatePingHistory(data.ping, data.jitter)

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
    }

    // Handle ping requests from server
    this.on('ping', ping)
    // Handle ping updates from server
    this.on('pingUpdate', pingUpdate)
  }

  on(event: string, handler: (...args: any[]) => any) {
    this.socket.on(event, handler)

    this.eventListener.push(() => {
      this.off(event, handler)
    })
  }

  off(event: string, handler: (...args: any[]) => any) {
    this.socket.off(event, handler)
  }

  dettachEventListeners() {
    let off = null
    while ((off = this.eventListener.pop())) {
      off()
    }
  }

  updatePingHistory(ping: number, jitter: number) {
    const timestamp = Date.now()
    this.pingHistory.push({ ping, jitter, timestamp })

    if (this.pingHistory.length > this.options.pingHistorySize) {
      this.pingHistory.shift()
    }
  }

  /**
   * Get the ping history
   */
  getPingHistory() {
    return [...this.pingHistory]
  }

  /**
   * Get current ping statistics
   */
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

  /**
   * Calculate average ping from history
   */
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

  /**
   * Get ping quality category
   * @returns {'excellent'|'good'|'fair'|'poor'}
   */
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
