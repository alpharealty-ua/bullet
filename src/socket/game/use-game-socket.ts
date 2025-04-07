import { useAuthStore } from '@/store/auth.store'
import { socketGame } from '@/socket/socket'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Offer } from '@/api/game.api'

type PullGameFn = (
  gameId: string,
  result?: {
    success: boolean
    position: number
    offer: Offer | null
  },
) => Promise<void>

// TODO: REFACTOR HOOK
const useGameSocket = (isPlay: boolean, pullGame: PullGameFn) => {
  const { gameId } = useParams<{ gameId: string }>()

  const token = useAuthStore(({ token }) => token)
  const [watchGame, setWatchGame] = useState<{
    gameId: string
    jackpot: number
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

    socketGame.emit('watch_game', gameId, (response: unknown) => {
      console.log('watch_game', response) // ok

      if (isUnmounted) {
        socketGame.emit('unwatch_game', gameId, (response: unknown) => {
          console.log('unwatch_game', response) // ok
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
    // const gameUpdate = (response: unknown) => {
    //   // console.log('game_update', response)
    // }
    // const offer_created = (response: unknown) => {
    //   // console.log('offer_created', response)
    // }
    // const offer_accepted = (response: unknown) => {
    //   // console.log('offer_accepted', response)
    // }
    // const offer_rejected = (response: unknown) => {
    //   // console.log('offer_rejected', response)
    // }
    // const next_largest_game = (response: unknown) => {
    //   console.log('next_largest_game', response)
    // }

    socketGame.on('pull_result', pullResult)
    // socket.on('game_update', gameUpdate)
    // socket.on('offer_created', offer_created)
    // socket.on('offer_accepted', offer_accepted)
    // socket.on('offer_rejected', offer_rejected)
    // socket.on('next_largest_game', next_largest_game)

    return () => {
      isUnmounted = true
      socketGame.emit('unwatch_game', gameId, (response: unknown) => {
        console.log('unwatch_game', response) // ok
      })

      socketGame.off('pull_result', pullResult)
      // socket.off('game_update', gameUpdate)
      // socket.off('offer_created', offer_created)
      // socket.off('offer_accepted', offer_accepted)
      // socket.off('offer_rejected', offer_rejected)
      // socket.off('next_largest_game', next_largest_game)
    }
  }, [isPlay, gameId, pullGame])

  useEffect(() => {
    if (gameId || isPlay) {
      return
    }
    let id: number | null = null
    let isUnmounted = false
    const call = () => {
      socketGame.emit(
        'watch_largest_prize',
        (response: { gameId: string; potentialWin: string }) => {
          if (isUnmounted) {
            return
          }

          setWatchGame({
            gameId: String(response.gameId),
            jackpot: Number(response.potentialWin!),
          })
        },
      )
      id = window.setTimeout(call, 1000)
    }
    call()
    return () => {
      isUnmounted = true
      if (id) {
        clearTimeout(id)
      }
    }
  }, [gameId, isPlay])

  return { watchGame }
}

export { useGameSocket }
