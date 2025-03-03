import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { useBalance } from '@/api/wallet.api'
import { useAllGames, useGameDetails } from '@/api/game.api'
import { useSettingsStore } from '@/store/settings.store'
import { useSoloStore } from '@/store/solo.store'
import { useSolo } from '@/context/use-solo'
import { ROUTES } from '@/routes/path'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { MAX_BET, VariantGame } from '@/lib/constants'
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
import { Debug } from '@/components/debug'

const Solo = ({ variant }: { variant: VariantGame }) => {
  const { next, deal, revolverRefHandle } = useSolo()
  const navigate = useNavigate()
  const [showHelpers, setShowHelpers] = useState(true)
  const { data: balance } = useBalance()
  const { data: gameDetails } = useGameDetails()
  const { data: allGames = [] } = useAllGames()
  const { gameId } = useParams<{ gameId: string }>()
  const setIsStartedGame = useSoloStore(
    ({ setIsStartedGame }) => setIsStartedGame,
  )
  const setNoMoney = useSoloStore(({ setNoMoney }) => setNoMoney)
  const setJackpot = useSoloStore(({ setJackpot }) => setJackpot)
  const setBet = useSoloStore(({ setBet }) => setBet)
  const setMaxBet = useSoloStore(({ setMaxBet }) => setMaxBet)
  const isStartedGame = useSoloStore(({ isStartedGame }) => isStartedGame)
  const noMoney = useSoloStore(({ noMoney }) => noMoney)
  const bet = useSoloStore(({ bet }) => bet)
  const offer = useSoloStore(({ offer }) => offer)
  const jackpot = Number(gameDetails?.potentialWin ?? 0)
  const invertButtons = useSettingsStore(({ invertButtons }) => invertButtons)

  const modal = useCustomModal()

  const handlePull = async () => {
    setShowHelpers(false)
    await next()
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
    if (activeGame && !isStartedGame) {
      navigate(`${ROUTES.solo.play}/${activeGame.id}`)
    }
  }, [allGames, navigate, isStartedGame])

  useEffect(() => {
    setIsStartedGame(Boolean(gameId))
  }, [gameId, setIsStartedGame])

  useEffect(() => {
    const syncedBet = isStartedGame ? Number(gameDetails?.betAmount ?? 0) : bet
    setBet(syncedBet)
  }, [isStartedGame, bet, gameDetails, gameId, setBet])

  useEffect(() => {
    const maxBet = Math.min(isStartedGame ? bet + balance : balance, MAX_BET)
    setMaxBet(maxBet)
  }, [isStartedGame, balance, bet, gameId, setMaxBet])

  useEffect(() => {
    const jackpot = Number(gameDetails?.potentialWin ?? 0)
    setJackpot(jackpot)
  }, [gameDetails, setJackpot])

  useEffect(() => {
    const noMoney = !isStartedGame && !(balance > 0 || bet > 0)
    setNoMoney(noMoney)
  }, [setNoMoney, isStartedGame, balance, bet])

  return (
    <>
      <Debug />
      <Header logoText={'Solo'} />
      <div className='mb-auto flex flex-col gap-1 pt-2'>
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
      </div>
      {noMoney && (
        <div className='relative flex flex-col items-center justify-center pt-8'>
          <ButtonWithAudio text='Add money' onClick={handleAddMoney} />
        </div>
      )}
      <div className='relative'>
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
