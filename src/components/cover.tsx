import { Logo } from './logo'
import { Button } from './ui/button'

const Cover = ({
  onPull,
  onGameRules,
}: {
  onPull: () => void
  onGameRules: () => void
}) => {
  return (
    <>
      <Logo size='3xl' />
      <Button image='pull' className='w-30' onClick={onPull} />
      <Button image='gamerules' onClick={onGameRules} />
    </>
  )
}

export { Cover }
