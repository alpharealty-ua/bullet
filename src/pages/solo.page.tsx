import { PullGameFn, useGameSocket } from '@/socket/game/use-game-socket'
import { ROUTES } from '@/routes/path'
import { useSettingsStore } from '@/store/settings.store'
import { useSolo } from '@/hooks/use-solo'
import { VariantGame } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { GameOver } from '@/components/game-over'
import { Revolver } from '@/components/guns/revolver'
import { Result } from '@/components/solo/result'
import { SoloFooter } from '@/components/solo/footer-solo'
import { Helper } from '@/components/solo/helper'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { AnimationInOut } from '@/components/ui/animation-in-out'
import { Victory } from '@/components/victory'
import { AddMoneyButton } from '@/components/ui/add-money-button'

const SoloPage = ({ variant }: { variant: VariantGame }) => {
  const invertButtons = useSettingsStore(({ invertButtons }) => invertButtons)

  const {
    footerHandleRef,
    gameOverHandleRef,
    victoryHandleRef,
    revolverHandleRef,
    jackpotHandleRef,
    multiplierHandleRef,
    offer,
    bet,
    jackpot,
    isStartedGame,
    multiplier,
    countBullet,
    noMoney,
    maxBet,
    showHelpers,
    setBet,
    pull,
    deal,
    newGame,
    winGame,
    gameOver,
    pullGame,
  } = useSolo(variant)

  const handlePull = async () => {
    await pull()
  }

  const handleDeal = async () => {
    await deal()
  }

  const hanldeGameOverClick = async () => {
    await newGame()
  }

  return (
    <>
      <div className='min-h-60'>
        {variant === 'watch' && (
          <WatchGame
            winGame={winGame}
            gameOver={gameOver}
            pullGame={pullGame}
          />
        )}
        {variant === 'play' &&
          (noMoney ? (
            <AddMoneyButton />
          ) : (
            <div className='flex flex-col gap-3 pt-2'>
              <Result
                title={'Prizepool'}
                value={`$${jackpot}`}
                open={jackpot !== -1}
                resultHandle={jackpotHandleRef}
              />
              <Result
                title={'Multiplier'}
                value={`${multiplier}x`}
                open={multiplier !== -1}
                resultHandle={multiplierHandleRef}
              />
              <Result
                title={'the banker offers...'}
                value={`$${offer ? offer.amount.slice(0, -2) : '0'}`}
                open={Boolean(offer)}
              />
            </div>
          ))}
      </div>
      <div className='relative mt-auto flex min-h-80 flex-1 items-end px-8 pt-2'>
        <Revolver
          gunHandleRef={revolverHandleRef}
          disabled={isStartedGame}
          className='h-full max-h-200 max-w-full'
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
              className={cn(
                'zoom-in-50 zoom-out-50',
                '[data-open="true"]:delay-1200 [data-open="true"]:duration-1000',
                '[data-close="true"]:duration-400',
              )}
            >
              <ButtonWithAudio
                as='button'
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
              as='button'
              className='w-24'
              image='pull'
              onClick={handlePull}
              skipWaitAnimation
            />
          </div>
        </div>
      </div>
      <Victory victoryHandleRef={victoryHandleRef} />
      <GameOver
        gameOverHandleRef={gameOverHandleRef}
        onClick={hanldeGameOverClick}
      />
      <SoloFooter
        footerHandleRef={footerHandleRef}
        disabledBet={isStartedGame || noMoney}
        maxBet={maxBet}
        bet={bet}
        countBullet={countBullet}
        setBet={setBet}
      />
    </>
  )
}

export { SoloPage }

// TODO: REFACTOR
const WatchGame = ({
  pullGame,
  gameOver,
  winGame,
}: {
  pullGame: PullGameFn
  gameOver: () => Promise<void>
  winGame: () => Promise<void>
}) => {
  const { watchGame, watchingLargestGame } = useGameSocket(
    pullGame,
    gameOver,
    winGame,
  )

  return (
    <>
      <div className='flex flex-col gap-6 p-4'>
        {!watchGame && watchingLargestGame && (
          <>
            <div className='text-xl'>Largest prize game</div>
            <div className='align-items flex items-center justify-between'>
              <Result
                title={'Prizepool'}
                value={`$${watchingLargestGame.jackpot}`}
                open={true}
              />
              <ButtonWithAudio
                as='link'
                to={`${ROUTES.solo.watch}/${watchingLargestGame.gameId}`}
                bg='primary'
              >
                Watch
              </ButtonWithAudio>
            </div>
          </>
        )}
        {watchGame && watchGame.game && (
          <div className='flex flex-col gap-3'>
            <div className='text-xl'>Game Details</div>
            <div className='grid grid-cols-2 gap-3'>
              <Result
                title={'Player'}
                value={watchGame.game.user.username}
                open={true}
              />
              <Result
                title={'Bet Amount'}
                value={`$${watchGame.game.formattedBetAmount}`}
                open={true}
              />
              <Result
                title={'Multiplier'}
                value={`${watchGame.game.multiplier}x`}
                open={true}
              />
              <Result
                title={'Status'}
                value={watchGame.game.status}
                open={true}
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
