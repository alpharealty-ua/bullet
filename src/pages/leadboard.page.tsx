import { Link } from 'react-router'
import { FaArrowLeft } from 'react-icons/fa'

import { ROUTES } from '@/routes/path'
import { Logo } from '@/components/logo'
import { Leaderboard } from '@/components/leaderboard'

const LeaderboardPage = () => {
  return (
    <>
      <header className='flex items-center justify-center gap-4 px-8 pt-12'>
        <Link to={ROUTES.root} className='flex w-0 justify-end'>
          <div className='w-8'>
            <FaArrowLeft className='text-red cursor-pointer text-3xl transition-all hover:text-black' />
          </div>
        </Link>
        <Logo as='link' to={ROUTES.root} size='xl' />
      </header>
      <div className='p-6'>
        <h1 className='mb-2 text-2xl font-bold'>Bullet Timing Leaderboard</h1>
        <p className='text-gray-500'>Population: 10,000 Players</p>
      </div>
      <Leaderboard />
    </>
  )
}

export { LeaderboardPage }
