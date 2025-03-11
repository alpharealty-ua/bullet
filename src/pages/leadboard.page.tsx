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
      <Leaderboard />
    </>
  )
}

export { LeaderboardPage }
