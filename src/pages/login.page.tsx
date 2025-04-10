import { LoginForm } from '@/components/forms/login.form'
import { Logo } from '@/components/logo'

const LoginPage = () => {
  return (
    <>
      <Logo as='link' to='/' size='xl' />
      <LoginForm />
    </>
  )
}

export { LoginPage }
