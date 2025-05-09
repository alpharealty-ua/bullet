import { LeaderboardButton } from '@/components/ui/leaderboard-button'
import { SettingsButton } from '@/components/ui/settings-button'
import { ButtonProps } from '@/components/ui/button'

interface FooterProps {
  leaderboardButton?: ButtonProps['as']
}

const Footer = ({ leaderboardButton = 'link' }: FooterProps) => {
  return (
    <footer className='flex w-full shrink-0 p-4'>
      <div className='flex grow items-center justify-between gap-1'>
        <div className='flex flex-col gap-1'>
          <SettingsButton />
          <div className='text-lg lg:text-2xl'>Active players: 311</div>
        </div>
        <LeaderboardButton as={leaderboardButton} className='w-20' />
      </div>
    </footer>
  )
}

export { Footer }
