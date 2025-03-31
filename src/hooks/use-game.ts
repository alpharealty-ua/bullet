import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { socketGame } from '@/socket/socket'
import { QUERY_KEYS } from '@/api/api'
import {
  Offer,
  useAcceptOffer,
  useAllGames,
  useGameDetails,
  useGamePull,
  useStartGame,
} from '@/api/game.api'
import { useBalance } from '@/api/wallet.api'
import { useSettingsStore } from '@/store/settings.store'
import { useGameStore } from '@/store/game.store'
import { ROUTES } from '@/routes/path'
import { randomIntFromInterval, wait, waitEndAudio } from '@/lib/utils'
import { MAX_BET, MULTIPLIERS, VariantGame } from '@/lib/constants'
import { RevolverHandle } from '@/components/guns/revolver'

// TODO: SPLIT DUEL AND SOLO
const useGame = (variant: VariantGame) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isSolo = pathname.includes(ROUTES.solo.root)
  const { gameId } = useParams<{ gameId: string }>()
  const queryClient = useQueryClient()
  const revolverRefHandle = useRef<RevolverHandle>(null)
  const disabledRef = useRef(false)
  const { data: gameDetails } = useGameDetails(isSolo && variant === 'play')
  const { mutateAsync: acceptOfferMutation } = useAcceptOffer()
  const { mutateAsync: startGameMutation } = useStartGame()
  const { data: allGames = [] } = useAllGames()
  const { mutateAsync: gamePullMutation } = useGamePull()
  const { data: balance } = useBalance()
  const playAudio = useSettingsStore(({ playAudio }) => playAudio)
  const declineAllDeals = useSettingsStore(
    ({ declineAllDeals }) => declineAllDeals,
  )
  const setCountBullet = useGameStore(({ setCountBullet }) => setCountBullet)
  const setOffer = useGameStore(({ setOffer }) => setOffer)
  const setBet = useGameStore(({ setBet }) => setBet)
  const setState = useGameStore(({ setState }) => setState)
  const setMultiplier = useGameStore(({ setMultiplier }) => setMultiplier)
  const setIsStartedGame = useGameStore(
    ({ setIsStartedGame }) => setIsStartedGame,
  )
  const setNoMoney = useGameStore(({ setNoMoney }) => setNoMoney)
  const setJackpot = useGameStore(({ setJackpot }) => setJackpot)
  const setMaxBet = useGameStore(({ setMaxBet }) => setMaxBet)
  const addRound = useGameStore(({ addRound }) => addRound)
  const restartGame = useGameStore(({ newGame }) => newGame)
  const state = useGameStore(({ state }) => state)
  const isStartedGame = useGameStore(({ isStartedGame }) => isStartedGame)
  const offer = useGameStore(({ offer }) => offer)
  const bet = useGameStore(({ bet }) => bet)
  const round = useGameStore(({ round }) => round)
  const isPlay = variant === 'play'
  const [watchGame, setWatchGame] = useState<{
    gameId: string
    jackpot: number
  } | null>(null)

  const newGame = useCallback(async () => {
    if (gameId && isSolo) {
      navigate(ROUTES.solo[variant], {
        preventScrollReset: true,
      })
    }

    await queryClient.setQueryData([QUERY_KEYS.gameDetails], null)

    restartGame()
  }, [restartGame, isSolo, navigate, queryClient, gameId, variant])

  const getMultiplier = useCallback(
    async (multiplierIndex: number): Promise<void> => {
      const revolverHandle = revolverRefHandle.current

      if (revolverHandle === null) {
        return
      }

      const length = MULTIPLIERS.length
      const AMOUNT_CHAMBER =
        length * Math.round(randomIntFromInterval(20, 30) / length) +
        multiplierIndex

      const spinAudio = await playAudio('spin')

      const END_DELAY = 100
      const DURATION_AUDIO = spinAudio.duration * 1000 - END_DELAY
      const interval = DURATION_AUDIO / AMOUNT_CHAMBER

      const FINISH_INDEX = AMOUNT_CHAMBER
      let currentIndex = 0

      return new Promise<void>((resolve) => {
        const spin = async (prevLag: number) => {
          const startSpin = Date.now()
          const correctLag = prevLag % interval
          const amountMissSpin = Math.floor(Math.abs(prevLag) / interval)

          currentIndex += amountMissSpin

          await revolverHandle.spin(interval + correctLag)

          const realInterval = Date.now() - (startSpin + correctLag)

          const lag = interval - realInterval
          const newIndex =
            Math.min(currentIndex++, FINISH_INDEX) % MULTIPLIERS.length
          const multiplier = MULTIPLIERS[newIndex]

          setMultiplier(multiplier)
          setJackpot(bet * multiplier)

          if (currentIndex > FINISH_INDEX) {
            return
          }

          return spin(lag)
        }

        spin(0).then(resolve)
      })
    },
    [bet, playAudio, setJackpot, setMultiplier],
  )

  const deal = async () => {
    if (offer) {
      await acceptOfferMutation(offer.id)
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.balance] })
      await playAudio('chaching')
      await newGame()
    }
  }

  const startGame = useCallback(
    async (result?: { gameId: string; multiplier: string }) => {
      const { gameId, multiplier } =
        result ??
        (await startGameMutation({
          betAmount: String(bet),
        }))

      // TODO: REMOVE
      setState('running')
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.balance] })
      const multiplierIndex = MULTIPLIERS.findIndex(
        (value) => value === Number(multiplier),
      )

      if (multiplierIndex === -1) {
        return
      }

      await getMultiplier(multiplierIndex)
      navigate(`${ROUTES.solo.play}/${gameId}`, { preventScrollReset: true })
    },
    [bet, getMultiplier, navigate, queryClient, setState, startGameMutation],
  )

  const gameOver = useCallback(async () => {
    setState('game-over')
  }, [setState])

  const winGame = useCallback(async () => {
    setState('win')

    const winSoundAudio = await playAudio('winsound', false)
    const chachingAudio = await playAudio('chaching', false)

    const startAudio = await new Promise<boolean>((resolve) => {
      setTimeout(() => resolve(false))
      chachingAudio.addEventListener('play', () => resolve(true))
    })

    startAudio && (await waitEndAudio(chachingAudio))
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.balance] })

    startAudio && (await waitEndAudio(winSoundAudio))

    newGame()
  }, [setState, newGame, playAudio, queryClient])

  const pullGame = useCallback(
    async (
      gameId: string,
      result?: { success: boolean; position: number; offer: Offer | null },
    ) => {
      const revolverHandle = revolverRefHandle.current

      if (revolverHandle === null) {
        return
      }

      const { success, position, offer } =
        result ?? (await gamePullMutation(gameId))

      const isGameOver = !success
      const isWin = !isGameOver && position === 5

      setCountBullet(5 - position)

      await revolverHandle.trigger()
      await revolverHandle.spin()
      await revolverHandle.click()

      if (isGameOver) {
        await revolverHandle.shot()
        await gameOver()
        return
      }
      if (isWin) {
        await winGame()
        return
      }
      if (offer && !declineAllDeals) {
        setOffer(offer)
      }
    },
    [
      declineAllDeals,
      gamePullMutation,
      setCountBullet,
      setOffer,
      gameOver,
      winGame,
    ],
  )

  // TODO: REMOVE
  // const nextDuel = useCallback(async () => {
  //   const frontCharacterHandle = frontCharacterHandleRef.current
  //   const backCharacterHandle = backCharacterHandleRef.current
  //   const frontGunHandle = frontCharacterHandle?.frontGunHandleRef?.current
  //   const backGunHandle = backCharacterHandle?.backGunHandleRef?.current
  //   const readySetPullHandle = readySetPullHandleRef.current
  //   const gameBarHandle = gameBarRefHandle.current

  //   if (!(readySetPullHandle && gameBarHandle)) {
  //     return
  //   }

  //   if (isStartedGame) {
  //     const { value, isRunning } = await gameBarHandle.getState()

  //     if (isRunning) {
  //       if (
  //         !(
  //           frontCharacterHandle &&
  //           backCharacterHandle &&
  //           frontGunHandle &&
  //           backGunHandle
  //         )
  //       ) {
  //         return
  //       }

  //       addPullRound()

  //       const isSkull = value === SKULL_VALUE
  //       const winProbabilityPercentage = value
  //       const random = randomIntFromInterval(0, 99)
  //       const inWinGame = !isSkull && random < winProbabilityPercentage

  //       await gameBarHandle.highlight()

  //       await backGunHandle.trigger()
  //       await backGunHandle.spin()
  //       await backGunHandle.click()

  //       if (inWinGame) {
  //         await backGunHandle.shot()
  //         await frontCharacterHandle.dead()
  //         return winGame()
  //       }

  //       const isGameOver = isSkull && randomIntFromInterval(1, 2) === 1

  //       if (isSkull) {
  //         await frontGunHandle.trigger()
  //         await frontGunHandle.spin()
  //         await frontGunHandle.click()
  //       }

  //       if (isGameOver) {
  //         await frontGunHandle.shot()
  //         await backCharacterHandle.dead()
  //         return gameOver()
  //       }
  //     } else {
  //       const duration = randomIntFromInterval(25, 50)
  //       await gameBarHandle.start(duration)
  //     }
  //   } else {
  //     await gameBarHandle.stop()
  //     await gameBarHandle.reset()
  //     await readySetPullHandle.startAll()
  //     const duration = randomIntFromInterval(25, 50)
  //     await gameBarHandle.start(duration)
  //   }
  // }, [gameOver, isStartedGame, winGame, addPullRound])

  const nextSolo = useCallback(async () => {
    if (!gameId) {
      await startGame()
      return
    }

    await pullGame(gameId)
  }, [gameId, pullGame, startGame])

  const next = useCallback(async () => {
    if (disabledRef.current) {
      return
    }

    try {
      disabledRef.current = true

      if (state === 'win' || state === 'game-over') {
        await newGame()
        return
      }

      await nextSolo()
    } catch (e) {
      console.log(e)
    } finally {
      disabledRef.current = false
    }
  }, [newGame, nextSolo, state])

  const nextRound = async () => {
    const DRAW_ROUND = 50

    if (round === DRAW_ROUND) {
      draw()

      return
    }

    addRound()
  }

  const draw = async () => {
    setState('draw')

    await wait(2000)
    await newGame()
  }

  useEffect(() => {
    const activeGame = allGames.find((game) => game.status === 'ACTIVE')
    if (activeGame && !gameId) {
      // setState('running')
      // navigate(`${ROUTES.solo.play}/${activeGame.id}`, { preventScrollReset: true })
    }
  }, [allGames, navigate, gameId, setState])

  useEffect(() => {
    const maxBet = Math.min(isStartedGame ? bet + balance : balance, MAX_BET)
    setMaxBet(maxBet)
  }, [isStartedGame, balance, bet, gameId, setMaxBet])

  useEffect(() => {
    if (!gameDetails) {
      return
    }

    const jackpot = Number(gameDetails.potentialWin ?? 0)
    const bet = Number(gameDetails.betAmount ?? 0)
    const multiplier = Number(gameDetails.multiplier ?? 0)
    const countBullet = 5 - Number(gameDetails.currentPosition ?? 0)
    const isActive = gameDetails.status === 'ACTIVE'
    const isPending = gameDetails.status === 'PENDING'
    const isGameOver = gameDetails.status === 'COMPLETED_LOSE'
    const isWin = gameDetails.status === 'COMPLETED_WIN'

    setJackpot(jackpot)
    setBet(bet)
    setCountBullet(countBullet)
    setMultiplier(multiplier)
    ;(isActive || isPending) && setState('running')
    isGameOver && setState('game-over')
    isWin && setState('win')
  }, [
    gameDetails,
    setState,
    setJackpot,
    setBet,
    setCountBullet,
    setMultiplier,
    setIsStartedGame,
    gameId,
  ])

  useEffect(() => {
    setIsStartedGame(Boolean(gameId))

    if (gameId) {
      return
    }

    // TODO: REMOVE
    variant === 'play' && newGame()
  }, [gameId, newGame, setIsStartedGame, variant])

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
    if (gameId || variant === 'play') {
      return
    }
    let id: NodeJS.Timeout | null = null
    let isUnmounted = false
    const call = () => {
      socketGame.emit('watch_largest_prize', (response: unknown) => {
        if (isUnmounted) {
          return
        }
        // TODO: USE ZOD
        if (
          !(
            response &&
            typeof response === 'object' &&
            'gameId' in response &&
            'potentialWin' in response
          )
        ) {
          return
        }
        setWatchGame({
          gameId: String(response.gameId),
          jackpot: Number(response.potentialWin!),
        })
      })
      id = setTimeout(call, 1000)
    }
    call()
    return () => {
      isUnmounted = true
      if (id) {
        clearTimeout(id)
      }
    }
  }, [variant, gameId])

  return {
    next,
    deal,
    newGame,
    nextRound,
    revolverRefHandle,
    watchGame,
    gameOver,
    winGame,
    draw,
  }
}

export { useGame }
