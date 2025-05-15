import { create } from 'zustand'

// TODO: MOVE TO STORE
import {
  ConnectionStatus,
  MatchDetails,
  MatchmakingStatus,
  PingData,
  Statistics,
} from '@/socket/matchmaker/matchmaker-soket.types'
import { Indicator } from '@/components/ui/indicators'

interface MatchmakerState {
  authenticated: boolean
  connectionStatus: ConnectionStatus
  matchmakingStatus: MatchmakingStatus
  gameId: string | null
  matchId: string | null
  playerId: string | null
  matchDetails: MatchDetails | null
  confirmationTimeoutSeconds: number
  indicators: { action: Indicator; playerId: string }[]
  pingData: PingData
  statistics: Statistics
}

const useMatchmakerStore = create<MatchmakerState>()(() => ({
  connectionStatus: 'disconnected',
  matchmakingStatus: 'not-in-queue',
  authenticated: false,
  gameId: null,
  matchId: null,
  playerId: null,
  matchDetails: null,
  confirmationTimeoutSeconds: 0,
  indicators: [],
  pingData: {
    ping: 0,
    jitter: 0,
    measurements: 0,
    history: [],
    sequence: 0,
  },
  statistics: {
    playersInQueue: 0,
    totalMatches: 0,
    averageWaitTime: 0,
  },
}))

export { useMatchmakerStore }
