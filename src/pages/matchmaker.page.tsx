import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router'

import { socketMatchmaker } from '@/socket/socket'
import { MatchmakerSocketEvents } from '@/socket/matchmaker/matchmaker-socket'
import { useUnmountedState } from '@/hooks/use-unmount-state'
import { useAuthStore } from '@/store/auth.store'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Matchmaker } from '@/components/matchmaker'
import { DuelGameBar } from '@/components/duel-game-bar'
import { useGameStore } from '@/store/game.store'
import { useUser } from '@/api/auth.api'

const MatchmakerPage = () => {
  const [params] = useSearchParams()
  const isNextSearch = params.get('next') != null
  const token = useAuthStore(({ accessToken }) => accessToken)
  const user = useUser()
  const characterName = useGameStore(({ characterName }) => characterName)

  const matchmakerEvents = useMemo(
    () =>
      new MatchmakerSocketEvents(socketMatchmaker, token!, {
        username: user.username,
        characterName,
        region: 'us-west',
      }),
    [characterName, token, user.username],
  )

  const isUnmounted = useUnmountedState()
  useEffect(() => {
    matchmakerEvents.connect()

    return () => {
      queueMicrotask(() => {
        if (!isUnmounted()) {
          return
        }

        matchmakerEvents.disconnect()
      })
    }
  }, [matchmakerEvents, isUnmounted])

  useEffect(() => {
    matchmakerEvents.attachEventListeners()

    return () => {
      matchmakerEvents.dettachEventListeners()
    }
  }, [matchmakerEvents])

  return (
    <>
      <Header logoText='duel' />
      <div className='flex grow flex-col items-center justify-center'>
        {isNextSearch && <DuelGameBar />}
        <Matchmaker
          matchmakerEvents={matchmakerEvents}
          isNextSearch={isNextSearch}
          autoJoin={isNextSearch}
        />
        {isNextSearch && <DuelGameBar />}
      </div>
      <Footer />
    </>
  )
}

export { MatchmakerPage }
