import { LeaderboardButton } from '@/components/ui/leaderboard-button'
import { SettingsButton } from '@/components/ui/settings-button'

const Footer = () => {
  return (
    <footer className='flex w-full shrink-0 justify-end p-4'>
      <div className='flex items-center gap-1'>
        <LeaderboardButton as='link' className='w-20' />
        <SettingsButton />
      </div>
    </footer>
  )
}

export { Footer }
