import { ROUTES } from '@/routes/path'
import { useSettingsStore } from '@/store/settings.store'
import { useSolo } from '@/hooks/use-solo'
import { useCustomModal } from '@/hooks/use-custom-modal'
import { VariantGame } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { GameOver } from '@/components/game-over'
import { Revolver } from '@/components/guns/revolver'
import { Result } from '@/components/result'
import { Footer } from '@/components/footer-solo'
import { AddMoneyModal } from '@/components/add-money-modal'
import { Helper } from '@/components/helper'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { AnimationInOut } from '@/components/animation-in-out'
import { Victory } from '@/components/victory'

const SoloPage = ({ variant }: { variant: VariantGame }) => {
  const modal = useCustomModal()
  const invertButtons = useSettingsStore(({ invertButtons }) => invertButtons)

  const {
    footerHandleRef,
    gameOverHandleRef,
    victoryHandleRef,
    revolverHandleRef,
    offer,
    bet,
    jackpot,
    isStartedGame,
    multiplier,
    countBullet,
    noMoney,
    maxBet,
    showHelpers,
    setShowHelpers,
    setBet,
    next,
    deal,
    watchGame,
  } = useSolo(variant)

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

  return (
    <>
      <div className='min-h-60'>
        {variant === 'watch' && watchGame && (
          <div className='flex flex-col gap-6 p-4'>
            <div className='text-3xl'>Largest prize game</div>
            <div className='align-items flex items-center justify-between'>
              <Result
                title={'Prizepool'}
                value={`$${watchGame.jackpot}`}
                open={true}
              />
              <ButtonWithAudio
                as='link'
                to={`${ROUTES.solo.watch}/${watchGame.gameId}`}
                bg='primary'
                text='Watch'
              />
            </div>
          </div>
        )}
        {variant === 'play' && !noMoney && (
          // TODO: ADD ANIMATION
          <div className='flex flex-col gap-3 pt-2'>
            <Result
              title={'Prizepool'}
              value={`$${jackpot}`}
              open={jackpot !== -1}
            />
            <Result
              title={'Multiplier'}
              value={`${multiplier}x`}
              open={multiplier !== -1}
            />
            <Result
              title={'the banker offers...'}
              value={`$${offer ? offer.amount : '0'}`}
              open={Boolean(offer)}
            />
          </div>
        )}
        {noMoney && (
          <div className='relative flex flex-col items-center justify-center pt-8'>
            <ButtonWithAudio
              as='button'
              image='button'
              text='Add money'
              onClick={handleAddMoney}
            />
          </div>
        )}
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
              timeout={400}
              className={cn(
                'zoom-in-50 zoom-out-50 mt-auto',
                'data-open:delay-1200 data-open:duration-1000',
                'data-close:duration-400',
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
      <GameOver gameOverHandleRef={gameOverHandleRef} />
      <Footer
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
