import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'

import { Offer } from '@/api/game.api'
import { gameSocket } from '@/socket/socket'
import { useAuthStore } from '@/store/auth.store'
import { useSoloStore } from '@/store/solo.store'

export type PullGameFn = (
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
const useGameSocket = (
  pullGame: PullGameFn,
  gameOver: () => Promise<void>,
  winGame: () => Promise<void>,
) => {
  const { gameId } = useParams<{ gameId: string }>()
  const setCountBullet = useSoloStore(({ setCountBullet }) => setCountBullet)
  const setBet = useSoloStore(({ setBet }) => setBet)
  const setJackpot = useSoloStore(({ setJackpot }) => setJackpot)
  const setMultiplier = useSoloStore(({ setMultiplier }) => setMultiplier)
  const setOffer = useSoloStore(({ setOffer }) => setOffer)
  const [error, setError] = useState('')

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
        gameSocket.disconnect()
      }
    }

    const onDisconnect = () => {
      console.log('disconnect')
    }

    gameSocket.auth = { token }
    gameSocket.connect()
    gameSocket.on('connect', onConnect)
    gameSocket.on('disconnect', onDisconnect)

    return () => {
      isUnmounted = true
      gameSocket.off('connect', onConnect)
      gameSocket.off('disconnect', onDisconnect)
      if (gameSocket.connected) {
        gameSocket.disconnect()
      }
    }
  }, [token])

  useEffect(() => {
    if (!gameId) {
      return
    }

    let isUnmounted = false

    setWatchGame(null)
    setWatchingLargestGame(null)

    gameSocket.emit('watch_game', gameId, (response: WatchGameResponse) => {
      console.log('watch_game', response)

      if (isUnmounted) {
        gameSocket.emit('unwatch_game', gameId, (response: unknown) => {
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

    gameSocket.on('pull_result', pullResult)
    gameSocket.on('game_update', gameUpdate)
    gameSocket.on('offer_created', offerCreated)
    gameSocket.on('offer_accepted', offerAccepted)
    gameSocket.on('offer_rejected', offerRejected)

    return () => {
      isUnmounted = true
      gameSocket.emit('unwatch_game', gameId, (response: unknown) => {
        console.log('unwatch_game', response) // ok
      })

      gameSocket.off('pull_result', pullResult)
      gameSocket.off('game_update', gameUpdate)
      gameSocket.off('offer_created', offerCreated)
      gameSocket.off('offer_accepted', offerAccepted)
      gameSocket.off('offer_rejected', offerRejected)
    }
  }, [gameId, pullGame])

  useEffect(() => {
    if (gameId) {
      return
    }

    const emitWatchLargestGame = () => {
      gameSocket.emit(
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
            setError(response.message)
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
  }, [gameId, navigate])

  // Update state from watched game if available (for watch mode)
  useEffect(() => {
    if (!watchGame?.game) {
      return
    }

    const game = watchGame.game

    setJackpot(Number(game.potentialWin))
    setBet(Number(game.betAmount))
    setCountBullet(5 - game.currentPosition)
    setMultiplier(game.multiplier)
    setOffer(game.currentOffer)

    const isGameOver = game.status === 'COMPLETED_LOSE'
    const isWin = game.status === 'COMPLETED_WIN'
    if (isGameOver) gameOver()
    if (isWin) winGame()
  }, [
    watchGame,
    gameOver,
    winGame,
    setJackpot,
    setBet,
    setCountBullet,
    setMultiplier,
    setOffer,
  ])

  useEffect(() => {
    return () => {
      setCountBullet(5)
      setBet(-1)
      setJackpot(-1)
      setMultiplier(-1)
      setOffer(null)
    }
  }, [setBet, setCountBullet, setJackpot, setMultiplier, setOffer])

  return { watchGame, watchingLargestGame, error }
}

export { useGameSocket }
