import { useNavigate, useParams } from 'react-router'

import { useUser } from '@/api/auth.api'
import { ROUTES } from '@/routes/path'
import { useDuelSocket } from '@/socket/duel/use-duel-socket'
import { useGameStore } from '@/store/game.store'
import { useAuthStore } from '@/store/auth.store'
import { VariantGame } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Bar } from '@/components/bar/bar'
import { DuelGameBar } from '@/components/duel-game-bar'
import { Character } from '@/components/character'
import { ReadySetPull } from '@/components/ready-set-pull'
import { GameOver } from '@/components/game-over'
import { Victory } from '@/components/victory'
import { RematchRequest } from '@/components/rematch-request'

const DuelPage = ({ variant }: { variant: VariantGame }) => {
  const navigate = useNavigate()
  const { gameId } = useParams() as { gameId: string }
  const user = useUser()
  const characterName = useGameStore(({ characterName }) => characterName)
  const playerId = user.id
  const token = useAuthStore(({ token }) => token)
  const matchDetails = useGameStore(({ matchDetails }) => matchDetails)

  const {
    gameOverHandleRef,
    victoryHandleRef,
    frontCharacterHandleRef,
    backCharacterHandleRef,
    topGameBarHandleRef,
    bottomGameBarHandleRef,
    readySetPullHandleRef,
    rematchRequestHandleRef,
    round,
    pull,
    requestRematch,
    hasPull,
    requestIndicator,
  } = useDuelSocket({ token: token!, gameId, playerId })

  const handlePull = async () => {
    pull()
  }

  const handleRequestRematch = async () => {
    requestRematch()
  }

  const handleCancelRematch = async () => {
    navigate(ROUTES.duel.play)
  }

  const handlePlayerClick = () => {
    frontCharacterHandleRef.current?.toggleInfo()
    backCharacterHandleRef.current?.toggleInfo()
  }

  return (
    <>
      <Header
        logoText={variant === 'play' ? 'duel' : ''}
        // TODO: CALC FLAG
        noMoney={false}
        headerProfile
      />
      {variant === 'watch' && <Bar />}
      <RematchRequest
        indicators={[requestIndicator.player, requestIndicator.opponnent]}
        onRequest={handleRequestRematch}
        onCancel={handleCancelRematch}
        rematchRequestHandleRef={rematchRequestHandleRef}
      />
      <div className='relative flex grow flex-col items-center justify-center pt-2'>
        <DuelGameBar gameBarRef={topGameBarHandleRef} />
        <div className='mt-auto w-full pt-6'>
          <div className='relative mt-auto flex flex-col gap-10'>
            <div
              className={cn(
                'relative flex min-h-[280px] grow-1 flex-col gap-2 pt-4',
                'animate-in fade-in duration-500',
              )}
            >
              <Character
                className={cn(
                  'mx-auto max-h-50 w-full max-w-48',
                  variant === 'watch' && '-mb-7 h-[300px]',
                  variant === 'play' && 'mr-12',
                )}
                name={matchDetails?.opponent.characterName ?? 'fatty'}
                type='front'
                onClick={handlePlayerClick}
                characterHandleRef={frontCharacterHandleRef}
                playerInfoProps={{
                  side: 'left',
                  level: 53,
                  login: matchDetails?.opponent.username ?? 'username',
                  win: 52,
                }}
              />
              <ReadySetPull readySetPullHandle={readySetPullHandleRef} />
            </div>
            <div className='relative mb-1 pb-10'>
              <Character
                className={cn('ml-6 max-h-[220px] max-w-[180px]')}
                name={characterName}
                type='back'
                onClick={handlePlayerClick}
                characterHandleRef={backCharacterHandleRef}
                playerInfoProps={{
                  side: 'right',
                  level: 53,
                  login: user.username,
                  win: 52,
                }}
              />
              <div className='absolute right-0 bottom-0 left-0 flex items-center justify-between px-4'>
                <div className='relative ml-auto'>
                  <ButtonWithAudio
                    as='button'
                    className='w-26'
                    image='pull'
                    onClick={handlePull}
                    disabled={!hasPull}
                    skipWaitAnimation
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <DuelGameBar gameBarRef={bottomGameBarHandleRef} />
      </div>
      <Victory victoryHandleRef={victoryHandleRef} />
      <GameOver gameOverHandleRef={gameOverHandleRef} />
      <Footer round={round} hasPull={hasPull} />
    </>
  )
}

export { DuelPage }
