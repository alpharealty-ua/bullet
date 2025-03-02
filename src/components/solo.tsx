import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { useBalance } from '@/api/wallet.api'
import { useAllGames, useGameDetails } from '@/api/game.api'
import { useSettings } from '@/store/settings.store'
import { useAppContext } from '@/context/use-app-context'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { VariantGame } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { GameOver } from './game-over'
import { Revolver } from './revolver'
import { Result } from './result'
import { Header } from './header'
import { Footer } from './footer'
import { AddMoneyModal } from './add-money-modal'
import { Helper } from './helper'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { AnimationInOut } from '@/components/animation-in-out'

const Solo = ({ variant }: { variant: VariantGame }) => {
  const {
    offer,
    next,
    deal,
    revolverRefHandle,
    bet: betClient,
  } = useAppContext()
  const [showHelpers, setShowHelpers] = useState(true)
  const { data: balance } = useBalance()
  const { data: gameDetails } = useGameDetails()
  const { data: allGames = [] } = useAllGames()
  const { gameId } = useParams<{ gameId: string }>()
  const isStartedGame = Boolean(gameId)
  const bet = isStartedGame ? Number(gameDetails?.betAmount ?? 0) : betClient
  const jackpot = Number(gameDetails?.potentialWin ?? 0)
  const navigate = useNavigate()
  const invertButtons = useSettings(({ invertButtons }) => invertButtons)

  const modal = useCustomModal()

  const handlePull = async () => {
    setShowHelpers(false)
    await next('solo', gameId)
  }

  const handleDeal = async () => {
    await deal()
  }

  const handleAddMoney = async () => {
    modal.show({
      contentSlot: <AddMoneyModal />,
    })
  }

  useEffect(() => {
    const activeGame = allGames.find((game) => game.status === 'ACTIVE')
    if (activeGame) {
      navigate(`${ROUTES.solo.play}/${activeGame.id}`)
    }
  }, [allGames, navigate])

  return (
    <>
      <Header logoText={'Solo'} />
      <Result
        title={'Jackpot'}
        price={jackpot}
        open={isStartedGame && Boolean(jackpot)}
      />
      <Result
        title={'the banker offers...'}
        price={offer}
        open={isStartedGame && Boolean(offer)}
      />
      {isStartedGame && !(balance > 0 || bet > 0) && (
        <div className='relative flex flex-col items-center justify-center pt-8'>
          <ButtonWithAudio text='Add money' onClick={handleAddMoney} />
        </div>
      )}
      <div className='relative mt-auto'>
        <Revolver
          gunHandleRef={revolverRefHandle}
          disabled={!isStartedGame}
          beforeSlot={<>{}</>}
          className='-mb-16 w-[216px] lg:-mb-12 lg:w-[251px]'
        />
        <div
          className={cn(
            'absolute right-0 bottom-4 left-0 flex items-center justify-between px-4',
            invertButtons && 'flex-row-reverse',
          )}
        >
          <div className='relative'>
            <AnimationInOut
              in={isStartedGame && Boolean(offer)}
              timeout={400}
              className={cn(
                'zoom-in-50 zoom-out-50 mt-auto',
                'data-open:delay-1200 data-open:duration-1000',
                'data-close:duration-400',
              )}
            >
              <ButtonWithAudio
                className='w-24'
                image='deal'
                onClick={handleDeal}
              />
            </AnimationInOut>
          </div>
          <div className='relative'>
            <Helper
              image='startgame'
              show={showHelpers && bet > 0 && !isStartedGame}
            />
            <ButtonWithAudio
              disabled={bet === 0}
              className='w-24'
              image='pull'
              onClick={handlePull}
            />
          </div>
        </div>
      </div>
      <GameOver />
      <Footer format='solo' variant={variant} showHelpers={showHelpers} />
    </>
  )
}

export { Solo }
