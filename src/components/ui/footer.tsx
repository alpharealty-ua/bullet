import { LeaderboardButton } from '@/components/ui/leaderboard-button'
import { SettingsButton } from '@/components/ui/settings-button'

const Footer = () => {
  return (
    <footer className='flex w-full shrink-0 p-4'>
      <div className='flex grow items-center justify-between gap-1'>
        <SettingsButton />
        <LeaderboardButton as='link' className='w-20' />
      </div>
    </footer>
  )
}

export { Footer }
