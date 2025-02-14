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
    <>
      <Logo size='3xl' />
      <Button image='play' className='w-30' onClick={onStart} />
      <Button image='gamerules' className='w-24' onClick={onGameRules} />
    </>
  )
}

export { Cover }
