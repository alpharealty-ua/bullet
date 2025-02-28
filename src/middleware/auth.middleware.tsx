import { useProfile } from '@/api/auth.api'
import { Loading } from '@/components/loading'

const AuthMiddleare = ({ children }: { children: React.ReactElement }) => {
  const { isLoading } = useProfile()

  if (isLoading) {
    return <Loading className='absolute inset-0' />
  }

  return children
}

export { AuthMiddleare }
