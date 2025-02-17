import { images } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Logo } from './logo'
import { Button } from './ui/button'

const Cover = ({
  onStart,
  onGameRules,
}: {
  onStart: () => void
  onGameRules: () => void
}) => {
  return (
    <div
      className={cn(
        'fill-mode-both custom-scroll absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 overflow-auto bg-cover bg-[right_center] px-3 py-12 duration-200',
      )}
      style={{ backgroundImage: `url(${images.wrapper})` }}
    >
      <Logo size='3xl' />
      <Button image='play' className='w-30' onClick={onStart} />
      <Button image='duel' className='w-30' onClick={onStart} />
      <Button image='gamerules' className='w-24' onClick={onGameRules} />
    </div>
  )
}

export { Cover }
