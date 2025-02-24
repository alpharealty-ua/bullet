import { useState } from 'react'

import { useAppContext } from '@/context/use-app-context'
import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Header } from './header'
import { Footer } from './footer'
import { Bar } from '@/components/bar/bar'
import { DuelGameBar } from './duel-game-bar'
import { Character } from './character'
import { PlayerInfo } from './player-info'
import { StartGameText } from './start-game-text'

const Watch = ({ format }: { format: 'duel' | 'watch' }) => {
  const { characterIndex } = useAppContext()
  const [startGame, setStartGame] = useState(false)

  const handlePull = () => {
    setStartGame(true)
  }

  return (
    <>
      <Header
        logoText={format === 'duel' ? 'duel' : ''}
        hideBalance={format === 'duel'}
      />
      <Bar />
      <div className='mt-5 flex flex-col gap-6'>
        <div className='relative mt-6 flex min-h-[280px] grow-1 flex-col gap-2 pt-4'>
          <Character
            className={cn(
              'mr-12 ml-auto h-[235px]',
              format === 'watch' && 'mx-auto -mb-7 h-[300px]',
            )}
            characterIndex={characterIndex}
          />
          <PlayerInfo
            className='absolute top-0 left-12'
            side='left'
            level={53}
            login={'Suni7222'}
            win={52}
          />
          {startGame && <StartGameText />}
        </div>
        {format === 'duel' && (
          <div className='relative mb-1'>
            <PlayerInfo
              className='absolute top-6 right-6'
              side='right'
              level={53}
              login={'Suni7222'}
              win={52}
            />
            <div
              className='relative ml-10 aspect-[190/220] w-[190px] items-end justify-center bg-contain bg-center bg-no-repeat'
              style={{ backgroundImage: `url(${images.opponent})` }}
            ></div>
            <div className='absolute right-0 bottom-0 flex items-center justify-between px-4'>
              <div className='relative'>
                <Button className='w-26' image='pull' onClick={handlePull} />
              </div>
            </div>
          </div>
        )}
      </div>
      {format === 'duel' && <DuelGameBar />}
      <Footer format={format} />
    </>
  )
}

export { Watch }
