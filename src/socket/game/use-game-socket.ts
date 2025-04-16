import { toast } from 'react-toastify'

import { useAuthStore } from '@/store/auth.store'
import { socketGame } from '@/socket/socket'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Offer } from '@/api/game.api'

type PullGameFn = (
  gameId: string,
  result?: {
    success: boolean
    position: number
    offer: Offer | null
  },
) => Promise<void>

type GameData = {
  id: string
  status: string
  betAmount: string
  multiplier: number
  potentialWin: string
  actualWin: string | null
  bulletPosition: number
  currentPosition: number
  network: {
    id: string
    symbol: string
  }
  coin: {
    id: string
    symbol: string
    decimals: number
  }
  user: {
    id: string
    username: string
  }
  pullAttempts: unknown[]
  currentOffer: Offer | null
  createdAt: string
  updatedAt: string
  formattedBetAmount: number
  formattedPotentialWin: number
  formattedActualWin: number
}

type WatchGameResponse = {
  success: boolean
  message: string
  game: GameData
}

type GameUpdateEvent = {
  gameId: string
  game: GameData
}

// TODO: REFACTOR HOOK
const useGameSocket = (isPlay: boolean, pullGame: PullGameFn) => {
  const { gameId } = useParams<{ gameId: string }>()

  const navigate = useNavigate()

  const token = useAuthStore(({ accessToken }) => accessToken)
  const [watchingLargestGame, setWatchingLargestGame] = useState<{
    gameId: string
    jackpot: number
    game?: GameData
  } | null>(null)
  const [watchGame, setWatchGame] = useState<{
    gameId: string
    jackpot: number
    game?: GameData
  } | null>(null)

  useEffect(() => {
    if (token === null) {
      return
    }

    let isUnmounted = false

    const onConnect = () => {
      console.log('connect')

      if (isUnmounted) {
        socketGame.disconnect()
      }
    }

    const onDisconnect = () => {
      console.log('disconnect')
    }

    socketGame.auth = { token }
    socketGame.connect()
    socketGame.on('connect', onConnect)
    socketGame.on('disconnect', onDisconnect)

    return () => {
      isUnmounted = true
      socketGame.off('connect', onConnect)
      socketGame.off('disconnect', onDisconnect)
      if (socketGame.connected) {
        socketGame.disconnect()
      }
    }
  }, [token])

  useEffect(() => {
    if (isPlay || !gameId) {
      return
    }
    let isUnmounted = false

    setWatchGame(null)
    setWatchingLargestGame(null)

    socketGame.emit('watch_game', gameId, (response: WatchGameResponse) => {
      console.log('watch_game', response)

      if (isUnmounted) {
        socketGame.emit('unwatch_game', gameId, (response: unknown) => {
          console.log('unwatch_game', response)
        })
        return
      }

      if (response.success && response.game) {
        setWatchGame({
          gameId: response.game.id,
          jackpot: Number(response.game.formattedPotentialWin),
          game: response.game,
        })
      }
    })

    const pullResult = (response: unknown) => {
      console.log('pull_result', response)
      pullGame(
        gameId,
        response as { success: boolean; position: number; offer: Offer | null },
      )
    }

    const gameUpdate = (response: GameUpdateEvent) => {
      console.log('game_update', response)

      if (response.gameId === gameId && response.game) {
        setWatchGame((prev) => {
          if (!prev)
            return {
              gameId: response.game.id,
              jackpot: Number(response.game.potentialWin),
              game: response.game,
            }

          return {
            ...prev,
            jackpot: Number(response.game.potentialWin),
            game: response.game,
          }
        })
      }
    }

    const offerCreated = (response: { gameId: string; offer: Offer }) => {
      console.log('offer_created', response)
      if (response.gameId === gameId) {
        setWatchGame((prev) => {
          if (!prev || !prev.game) return prev

          return {
            ...prev,
            game: {
              ...prev.game,
              currentOffer: response.offer,
            },
          }
        })
      }
    }

    const offerAccepted = (response: { gameId: string; offerId: string }) => {
      console.log('offer_accepted', response)
      // Handle offer accepted event
    }

    const offerRejected = (response: { gameId: string; offerId: string }) => {
      console.log('offer_rejected', response)
      // Handle offer rejected event
    }

    socketGame.on('pull_result', pullResult)
    socketGame.on('game_update', gameUpdate)
    socketGame.on('offer_created', offerCreated)
    socketGame.on('offer_accepted', offerAccepted)
    socketGame.on('offer_rejected', offerRejected)

    return () => {
      isUnmounted = true
      socketGame.emit('unwatch_game', gameId, (response: unknown) => {
        console.log('unwatch_game', response) // ok
      })

      socketGame.off('pull_result', pullResult)
      socketGame.off('game_update', gameUpdate)
      socketGame.off('offer_created', offerCreated)
      socketGame.off('offer_accepted', offerAccepted)
      socketGame.off('offer_rejected', offerRejected)
    }
  }, [isPlay, gameId, pullGame])

  useEffect(() => {
    if (gameId || isPlay) {
      return
    }

    const emitWatchLargestGame = () => {
      socketGame.emit(
        'watch_largest_prize',
        (
          response:
            | {
                success: true
                message: string
                gameId: string
                game: GameData
                potentialWin: number
              }
            | { success: false; message: string },
        ) => {
          if (!response.success) {
            clearTimeout(interalID)
            toast.error(response.message)
            return
          }

          setWatchingLargestGame({
            gameId: response.gameId,
            jackpot: response.potentialWin,
            game: response.game,
          })

          // redirect to game page
          // navigate(ROUTES.solo.watchGame(response.gameId))
        },
      )
    }
    emitWatchLargestGame()

    const interalID = setInterval(emitWatchLargestGame, 1000)
    return () => {
      clearTimeout(interalID)
    }
  }, [gameId, isPlay, navigate])

  return { watchGame, watchingLargestGame }
}

export { useGameSocket }
