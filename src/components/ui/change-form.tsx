import { ROUTES } from '@/routes/path'
import { Link } from 'react-router'

const ChangeForm = ({ type }: { type: 'login' | 'register' }) => {
  const isLogin = type === 'login'
  return (
    <div className='flex flex-col items-center gap-1'>
      <span>
        {isLogin ? "Don't have an account yet?" : 'Already have an account?'}
      </span>
      <Link
        to={isLogin ? ROUTES.resiter : ROUTES.login}
        className='text-primary'
      >
        {isLogin ? 'Sign up' : ' Sign in'}
      </Link>
    </div>
  )
}

export { ChangeForm }
