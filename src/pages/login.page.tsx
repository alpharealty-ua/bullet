import { LoginForm } from '@/components/forms/login.form'
import { Logo } from '@/components/logo'

const LoginPage = () => {
  return (
    <>
      <header className='flex items-center justify-center px-3 py-2'>
        <Logo to='/' size='lg' />
      </header>
      <LoginForm />
    </>
  )
}

export { LoginPage }
