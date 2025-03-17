import { Link } from 'react-router'
import { FaArrowLeft } from 'react-icons/fa'

import { Logo } from '@/components/logo'
import { Leaderboard } from '@/components/leaderboard'

const LeaderboardPage = () => {
  return (
    <>
      <header className='flex items-center justify-between gap-2 px-3 py-12'>
        <div className='flex items-center gap-4'>
          <Link to='/'>
            <FaArrowLeft className='text-red cursor-pointer text-3xl transition-all hover:text-black' />
          </Link>
          <Logo as='link' to='/' size='lg' />
        </div>
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
